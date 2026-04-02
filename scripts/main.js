let syncQueue = JSON.parse(localStorage.getItem('syncQueue') || '[]');

window.addEventListener('online', function() {
    console.log('🟢 กลับมาออนไลน์แล้ว');
    showToast('🟢 กลับมาออนไลน์ กำลังซิงค์ข้อมูล...', 'info');
    processSyncQueue();
});

window.addEventListener('offline', function() {
    console.log('🔴 ออฟไลน์');
    showToast('🔴 กำลังทำงานในโหมดออฟไลน์', 'info');
});

function addToSyncQueue(data, action) {
    syncQueue.push({
        id: data.id || `temp_${Date.now()}`,
        data: data,
        action: action,
        timestamp: Date.now()
    });
    
    localStorage.setItem('syncQueue', JSON.stringify(syncQueue));
    
    console.log(`📦 เพิ่มเข้าคิว: ${action}`, data);
}

async function processSyncQueue() {
    if (!navigator.onLine || !isLoggedIn) {
        console.log('⏳ รอซิงค์... (ไม่มีเน็ตหรือยังไม่ login)');
        return;
    }
    
    if (syncQueue.length === 0) {
        console.log('✅ ไม่มีคิวที่ต้องซิงค์');
        return;
    }
    
    showToast(`🔄 กำลังซิงค์ ${syncQueue.length} รายการ...`, 'info');
    
    let success = 0;
    let failed = 0;
    let newQueue = [];
    
    for (const item of syncQueue) {
        try {
            if (item.action === 'create') {
                await saveTransactionToBackend(item.data);
            } else if (item.action === 'update') {
                await updateTransactionInBackend(item.data);
            } else if (item.action === 'delete') {
                await deleteTransactionFromBackend(item.data.id);
            }
            success++;
        } catch (error) {
            console.error('Sync failed:', error);
            failed++;
            newQueue.push(item); 
        }
    }
    
    syncQueue = newQueue;
    localStorage.setItem('syncQueue', JSON.stringify(syncQueue));
    
    if (failed === 0) {
        showToast(`✅ ซิงค์สำเร็จ ${success} รายการ`, 'success');
    } else {
        showToast(`⚠️ ซิงค์สำเร็จ ${success} รายการ, ล้มเหลว ${failed} รายการ`, 'info');
    }
}


const defaultCategories = {
    income: [{ id: 'salary', label: 'เงินเดือน', icon: '💰' }, { id: 'bonus', label: 'โบนัส', icon: '🎁' }, { id: 'invest_inc', label: 'กำไรลงทุน', icon: '💹' }, { id: 'other_inc', label: 'อื่นๆ', icon: '🏦' }],
    spending: [{ id: 'eat', label: 'กิน', icon: '🍱', default: null }, { id: 'fuel', label: 'น้ำมัน', icon: '⛽', default: null }, { id: 'social', label: 'สังคม', icon: '🤝', default: null }, { id: 'family', label: 'ครอบครัว', icon: '👨‍👩‍👧‍👦', default: null }, { id: 'supplies', label: 'ของใช้', icon: '🧺', default: null }, { id: 'ent', label: 'สิ่งบันเทิง', icon: '🎬', default: null }, { id: 'travel', label: 'ท่องเที่ยว', icon: '✈️', default: null }, { id: 'health', label: 'สุขภาพ', icon: '🏥', default: null }, { id: 'car', label: 'รถยนต์', icon: '🚗', default: null }],
    investment: [{ id: 'kid_saving', label: 'เงินเก็บลูก', icon: '👶', default: null }, { id: 'short_res', label: 'สำรองระยะสั้น', icon: '🛡️', default: null }, { id: 'invest_prep', label: 'เก็บเตรียมลงทุน', icon: '💎', default: null }],
};

const updateLogs = [
        {
        date: "2 Mar 2026",
        version: "1.0.3",
        title: "Update & Fixes",
        changes: [
            "1.แก้ไขในส่วน javascript ในเรื่อง ขนาด Font ในช่อง Calendargrid เกินเปลี่ยนจากแสดงตัวเลขเป็น จุด เพื่อให้แสดงผลได้ดีขึ้นใน Mobile",
            "2.แก้บัคเกี่ยวกับปัญหา ไม่แสดงประวัติรายการ ในเดือนก่อนหน้า เมื่อกดดูประวัติในเดือนนั้นๆ ใน Mobile&Desktop",
        ],
        icon: "📝"
    },
            {
        date: "3 Mar 2026",
        version: "1.0.4",
        title: "Update & Fixes",
        changes: [
            "1.แก้ไข Edit account ให้สามารถ แก้ไขปรับยอดคงเหลือของ บัญชีได้",
            "2.ปรับเพิ่มหมวดหมู่ รายรับ ในหน้า page รายปี และปรับให้แสดงเฉพาะ หมวดหมู่ที่มียอดเท่านั้น",
        ],
        icon: "📝"
    }
    ,
            {
        date: "4 Mar 2026",
        version: "1.0.5",
        title: "Update & Fixes",
        changes: [
            "1.ในหน้า page รายปี เพิ่มแก้ไขให้ สามารถกดดูรายการ Transaction ของหมวดนั้นๆในเดือนนั้นๆได้ (เฉพาะหมวดหมู่ที่มียอดเท่านั้น)",
        ],
        icon: "📝"
    }
    ,
                {
        date: "10 Mar 2026",
        version: "1.0.6",
        title: "Update & Fixes",
        changes: [
            "1.แก้ไขการแสดง TAG ในหน้า กรอกข้อมูล [รับ/จ่าย] ให้แสดงได้สูงสุด 15 TAG",
            "2.ปรับปรุง Layout ในหน้า [รับ/จ่าย],จัดการหนี้ ให้ดูดีขึ้นใน Mobile mode",
        ],
        icon: "📝"
    }
    ,
                {
        date: "3 Apr 2026",
        version: "1.0.7",
        title: "Update & Fixes",
        changes: [
            "1.เพิ่มระบบ Login",
            "2.ปรับปรุงประสิทธิภาพการทำงานในส่วนต่างๆ ให้ทำงานได้ดีขึ้น",
        ],
        icon: "📝"
    }

];


function openUpdateLog() {
    console.log("📝 เปิดหน้า Log Update");
    if (isMobile() && sideMenuOpen) {
        closeMobileSideMenu();
    }
    
    const sortedLogs = [...updateLogs].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    const logHTML = sortedLogs.map(log => `
        <div class="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
            <div class="flex justify-between items-start mb-3">
                <div class="flex items-center gap-3">
                    <span class="text-2xl">${log.icon}</span>
                    <div>
                        <h4 class="font-bold text-sm dark:text-white">${log.title}</h4>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full dark:bg-indigo-900/30 dark:text-indigo-400">
                                v${log.version}
                            </span>
                            <span class="text-xs text-slate-400">${formatThaiDate(log.date)}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <ul class="space-y-2">
                ${log.changes.map(change => `
                    <li class="flex items-start gap-2">
                        <span class="text-emerald-500 mt-0.5">✓</span>
                        <span class="text-sm text-slate-600 dark:text-slate-300">${change}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
    `).join('');
    
    document.getElementById('updateLogContent').innerHTML = logHTML;
    
    const latestLog = sortedLogs[0];
    if (latestLog) {
        document.getElementById('lastUpdateDate').textContent = formatThaiDate(latestLog.date);
    }
    
    document.getElementById('updateLogModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeUpdateLog() {
    document.getElementById('updateLogModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function formatThaiDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    };
    return date.toLocaleDateString('th-TH', options);
}

const transferTypes = {
    INTERNAL: 'internal',      
    AS_INCOME: 'as_income'     
};

        let customCategories = JSON.parse(localStorage.getItem('fin_custom_cats')) || defaultCategories;
        let transactions = JSON.parse(localStorage.getItem('fin_tx_v5')) || [];
        let categoryTargets = JSON.parse(localStorage.getItem('fin_targets_v5')) || {};

const defaultAccounts = [
    {
        id: 'default_acc', 
        name: 'บัญชีหลัก',
        type: 'savings',
        color: '#6366f1',
        icon: '🏦',
        initialBalance: 0,
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'cash_acc',  
        name: 'เงินสด',
        type: 'cash',
        color: '#10b981',
        icon: '💰',
        initialBalance: 0,
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

let accounts = JSON.parse(localStorage.getItem('fin_accounts')) || defaultAccounts;
let currentAccountId = localStorage.getItem('fin_current_account') || 'default_acc';
let accountFilterId = 'all'; 
let budgetMode = 'percentage'; 

let backendTransactions = [];  
let isShowingBackendData = false;  


        let currentDate = new Date();
        let displayYear = currentDate.getFullYear();
        let currentType = 'income', currentManageType = 'spending', editingTxId = null, editingCatId = null, editingTagName = null, selectedIcon = '📁', yearlyChart = null, currentFontSize = localStorage.getItem('fin_fontsize') || 'medium';
let reportDateRange = {
    startDate: null,
    endDate: null,
    accountId: 'all', 
    isCustomRange: false
};
        
        let analysisPeriod = 'month'; 
        let analysisDate = new Date(); 

        let currentDebtTab = 'active';
        let analysisCharts = {
            spendingPie: null,
            incomeExpense: null,
            categoryComparison: null,
            tagComparison: null,
            incomeTrend: null,
            expenseTrend: null
        };
        let currentPieChartTab = 'categories'; 
        let tagPieChart = null; 

         let isRefreshing = false;
        const emojiLib = ["💰", "🎁", "💹", "🏦", "🍱", "⛽", "🤝", "👨‍👩‍👧‍👦", "🧺", "🎬", "✈️", "🏥", "🚗", "🍜", "☕", "🍺", "🍦", "🍎", "🛍️", "👗", "👞", "💊", "👶", "🐶", "🎮", "💻", "📷", "🎨", "📚", "🖊️", "⚽", "🚴", "🚲", "🏠", "💡", "🔌", "💳", "💵", "💎", "🛡️", "🔑", "❤️", "⭐", "🍀", "🌈", "🔥", "💯", "✅", "❌", "⚠️", "🔔", "🎵", "🕒", "🍕", "🍔", "🍣", "🍩", "🥤"];
        const monthNames = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
        const monthFullNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
async function checkStorageStatus() {
    try {
     
        let lsReady = false;
        let lsDetails = '';
        let lsItems = 0;
        
        try {
            if (typeof localStorage !== 'undefined') {
                const testKey = 'test_storage_' + Date.now();
                localStorage.setItem(testKey, 'test');
                const retrieved = localStorage.getItem(testKey);
                localStorage.removeItem(testKey);
                
                lsReady = retrieved === 'test';
                
                const transactionKeys = ['fin_tx_v5']; 
                
                lsTransactionCount = transactionKeys.reduce((total, key) => {
                    try {
                        const data = JSON.parse(localStorage.getItem(key) || '[]');
                        if (Array.isArray(data)) {
                            return total + data.length;
                        }
                    } catch (e) {
                    }
                    return total;
                }, 0);
                
                lsDetails = `พบ ${lsTransactionCount} รายการ`;
                
            } else {
                lsDetails = 'เบราว์เซอร์ไม่รองรับ';
            }
        } catch (lsError) {
            lsDetails = `เกิดข้อผิดพลาด: ${lsError.message}`;
        }
        
        let idbReady = false;
        let idbDetails = '';
        let idbItems = 0;
        
        try {
            if (window.indexedDB) {
                if (financeDB && financeDB.db) {
                    idbReady = true;
                    if (financeDB.getAllTransactions) {
                        const transactions = await financeDB.getAllTransactions();
                        idbItems = transactions.length;
                        idbDetails = `พบ ${idbItems} รายการ`;
                    }
                } else {
                    idbDetails = 'ฐานข้อมูลยังไม่ถูกเปิด';
                }
            } else {
                idbDetails = 'เบราว์เซอร์ไม่รองรับ';
            }
        } catch (idbError) {
            idbDetails = `เกิดข้อผิดพลาด: ${idbError.message}`;
        }
        
        let operatingMode = '';
        if (lsReady && idbReady) {
            operatingMode = 'Hybrid (IndexedDB + LocalStorage)';
        } else if (idbReady) {
            operatingMode = 'IndexedDB เท่านั้น';
        } else if (lsReady) {
            operatingMode = 'LocalStorage เท่านั้น';
        } else {
            operatingMode = 'ไม่สามารถใช้งานได้';
        }
        
        let pendingCount = 0;
        try {
            const memoryCount = transactions.length;
            let dbCount = 0;
            
            if (financeDB && financeDB.getAllFromIndexedDB) {
                const dbTransactions = await financeDB.getAllFromIndexedDB('transactions');
                dbCount = dbTransactions.length;
            }
            
            pendingCount = Math.max(0, memoryCount - dbCount);
        } catch (pendingError) {
        }
        
        const alertMessage = 
`📊 สถานะระบบจัดเก็บข้อมูล:
• LocalStorage: ${lsReady ? 'พร้อมใช้งาน' : 'ไม่พร้อม'}
  ${lsDetails}
• IndexedDB: ${idbReady ? 'พร้อมใช้งาน' : 'ไม่พร้อม'}
  ${idbDetails}

• โหมดการทำงาน: ${operatingMode}

• จำนวนรายการ pending: ${pendingCount} รายการ
  ${pendingCount > 0 ? 'มีรายการที่ยังไม่บันทึกลงฐานข้อมูล' : 'ไม่มีรายการ pending'}
------------------------
ตรวจสอบเมื่อ: ${new Date().toLocaleString()}`;

        alert(alertMessage);
        
        console.log('Storage Status Check Complete:', {
            localStorage: { ready: lsReady, items: lsItems },
            indexedDB: { ready: idbReady, items: idbItems },
            operatingMode,
            pendingCount
        });
        
    } catch (error) {
        console.error('Storage check failed:', error);
        alert(`❌ ตรวจสอบสถานะ Storage ไม่สำเร็จ:\n${error.message}`);
    }
}

function setStatus(elementId, text, statusClass) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
        element.className = 'status-badge';
        if (statusClass) {
            element.classList.add(statusClass);
        }
    }
}

function closeStorageStatusModal() {
    document.getElementById('storageStatusModal').classList.add('hidden');
}


class FinanceDB {
    constructor() {
        this.db = null;
        this.dbName = 'FinanceFlowDB';
        this.dbVersion = 3;
        this.initialized = false;
        this.initPromise = null;
        this.saveToLocalEnabled = true; 
    }


    async getTransactionsByDate(dateStr) {
    await this.ensureInitialized();
    
    try {
        let transactions = [];
        
        if (this.db) {
            const allTxs = await this.getAllFromIndexedDB('transactions');
            transactions = allTxs.filter(t => t.rawDate === dateStr);
            
            if (transactions.length > 0) {
                console.log(`Found ${transactions.length} transactions in IndexedDB for ${dateStr}`);
                return transactions;
            }
        }
        
        const memoryTxs = this.getFromLocalStorageFallback().filter(t => t.rawDate === dateStr);
        if (memoryTxs.length > 0) {
            console.log(`Found ${memoryTxs.length} transactions in LocalStorage for ${dateStr}`);
            return memoryTxs;
        }
        
        return [];
        
    } catch (error) {
        console.error('Error getting transactions by date:', error);
        return [];
    }
}

    
    async init() {
    if (this.initPromise) return this.initPromise;
    
    this.initPromise = (async () => {
        try {
            await this.initIndexedDB();
            
            if (this.db) {
                const allTransactions = await this.getAllFromIndexedDB('transactions');
                
                window.transactions = allTransactions;
                
                console.log(`📊 FinanceDB: โหลด ${allTransactions.length} รายการ (ทุกเดือน)`);
                
                await this.loadRecentToCache();
            }
            
            this.initialized = true;
            console.log('FinanceDB initialized successfully');
            return true;
            
        } catch (error) {
            console.error('FinanceDB initialization failed:', error);
            return false;
        }
    })();
    
    return this.initPromise;
}
    
    async initIndexedDB() {
        return new Promise((resolve, reject) => {
            if (!window.indexedDB) {
                console.warn('IndexedDB not supported, falling back to LocalStorage');
                this.db = null;
                resolve(false);
                return;
            }
            
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onerror = (event) => {
                console.error('IndexedDB error:', event.target.error);
                reject(new Error('IndexedDB initialization failed'));
            };
            
            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('IndexedDB opened successfully');
                resolve(true);
                
                this.db.onversionchange = () => {
                    this.db.close();
                    console.log('Database is outdated, please reload the page.');
                };
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                const oldVersion = event.oldVersion;
                
                console.log(`Upgrading database from version ${oldVersion} to ${this.dbVersion}`);
                

            if (oldVersion < 1) {
                if (!db.objectStoreNames.contains('transactions')) {
                    const txStore = db.createObjectStore('transactions', {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    
                    txStore.createIndex('date', 'date');
                    txStore.createIndex('monthKey', 'monthKey');
                    txStore.createIndex('category', 'category');
                    txStore.createIndex('type', 'type');
                    txStore.createIndex('tag', 'tag');
                    txStore.createIndex('amount', 'amount');
                    
                    console.log('Created transactions store with indexes');
                }
                
                if (!db.objectStoreNames.contains('categories')) {
                    db.createObjectStore('categories', { keyPath: 'id' });
                    console.log('Created categories store');
                }
                
                if (!db.objectStoreNames.contains('budgets')) {
                    db.createObjectStore('budgets', { keyPath: 'id' });
                    console.log('Created budgets store');
                }
                
                if (!db.objectStoreNames.contains('metadata')) {
                    db.createObjectStore('metadata', { keyPath: 'key' });
                    console.log('Created metadata store');
                }
                if (!db.objectStoreNames.contains('accounts')) {
                db.createObjectStore('accounts', { keyPath: 'id' });
                console.log('✅ Created accounts store (was missing)');
                }
                const requiredStores = ['transactions', 'categories', 'budgets', 'metadata', 'accounts'];
                requiredStores.forEach(storeName => {
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName, { keyPath: storeName === 'metadata' ? 'key' : 'id' });
                        console.log(`✅ Created missing store: ${storeName}`);
                    }});
            }};
        });
    }

    async migrateAccounts(accountsData) {
    if (!this.db) return false;
    
    return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['accounts'], 'readwrite');
        const store = transaction.objectStore('accounts');
        
        const request = store.put({
            id: 'user_accounts',
            data: accountsData,
            updatedAt: new Date().toISOString()
        });
        
        request.onsuccess = () => resolve(true);
        request.onerror = (event) => {
            console.error('Account migration failed:', event.target.error);
            reject(event.target.error);
        };
    });
}
    
    
async checkAndMigrateFromLocalStorage() {
    try {
        const legacyTransactions = JSON.parse(localStorage.getItem('fin_tx_v5') || '[]');
        const legacyCategories = JSON.parse(localStorage.getItem('fin_custom_cats') || 'null');
        const legacyTargets = JSON.parse(localStorage.getItem('fin_targets_v5') || 'null');
        
        if (legacyTransactions.length === 0) {
            console.log('No legacy data to migrate');
            return;
        }
        
        console.log(`Found ${legacyTransactions.length} transactions in LocalStorage`);
        
        console.log('First time migration, migrating all transactions...');
        
        if (this.db) {
            await this.migrateTransactions(legacyTransactions);
        }
        
        if (legacyCategories) {
            await this.migrateCategories(legacyCategories);
        }
        
        if (legacyTargets) {
            await this.migrateBudgetTargets(legacyTargets);
        }
        
        await this.setMetadata('migration_v1_done', true);
        await this.setMetadata('migration_date', new Date().toISOString());
        await this.setMetadata('migrated_records', uniqueTransactions.length);
        await this.setMetadata('original_records', legacyTransactions.length);
        
        console.log(`Migration completed: ${uniqueTransactions.length} records (from ${legacyTransactions.length} original)`);
        
    } catch (error) {
        console.error('Migration failed:', error);
    }
}
    
async migrateTransactions(transactions) {
    return new Promise((resolve, reject) => {
        if (!this.db) {
            resolve(false);
            return;
        }
        
        const transaction = this.db.transaction(['transactions'], 'readwrite');
        const store = transaction.objectStore('transactions');
        
        let migrated = 0;
        let errors = 0;
        let duplicatesSkipped = 0; 
        
        const batchSize = 100;
        const batches = Math.ceil(transactions.length / batchSize);
        
        const processBatch = (batchIndex) => {
            const start = batchIndex * batchSize;
            const end = Math.min(start + batchSize, transactions.length);
            const batch = transactions.slice(start, end);
            
            batch.forEach(tx => {
                let transactionId = tx.id;
                
                if (!transactionId) {
                    transactionId = Date.now() + Math.random().toString(36).substr(2, 9);
                }
                
                const date = new Date(tx.date || new Date());
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                const uniqueId = `${transactionId}_${year}${month}`;
                
                const normalizedTx = {
                    ...tx,
                    id: uniqueId, 
                    originalId: tx.id, 
                    date: tx.date || new Date().toISOString().split('T')[0],
                    monthKey: tx.monthKey || this.getMonthKeyFromDate(tx.date || new Date()),
                    migratedAt: new Date().toISOString()
                };
                
                const request = store.put(normalizedTx);
                
                request.onsuccess = () => {
                    migrated++;
                };
                
                request.onerror = (event) => {
                    if (event.target.error.name === 'ConstraintError') {
                        duplicatesSkipped++;
                        console.warn('Duplicate skipped:', uniqueId);
                    } else {
                        console.warn('Failed to migrate transaction:', tx, event.target.error);
                        errors++;
                    }
                };
            });
            
            if (end < transactions.length) {
                setTimeout(() => processBatch(batchIndex + 1), 50);
            } else {
                transaction.oncomplete = () => {
                    console.log(`✅ Migrated ${migrated} transactions, ${errors} errors, ${duplicatesSkipped} duplicates skipped`);
                    resolve({
                        success: true,
                        migrated: migrated,
                        errors: errors,
                        duplicatesSkipped: duplicatesSkipped
                    });
                };
                
                transaction.onerror = (event) => {
                    console.error('Transaction migration failed:', event.target.error);
                    reject(event.target.error);
                };
            }
        };
        
        processBatch(0);
    });
}
    
    async migrateCategories(categories) {
        if (!this.db) return false;
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['categories'], 'readwrite');
            const store = transaction.objectStore('categories');
            
            const request = store.put({
                id: 'custom_categories',
                data: categories,
                updatedAt: new Date().toISOString()
            });
            
            request.onsuccess = () => resolve(true);
            request.onerror = (event) => {
                console.error('Category migration failed:', event.target.error);
                reject(event.target.error);
            };
        });
    }
    
    async migrateBudgetTargets(targets) {
        if (!this.db) return false;
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['budgets'], 'readwrite');
            const store = transaction.objectStore('budgets');
            
            const request = store.put({
                id: 'budget_targets',
                data: targets,
                updatedAt: new Date().toISOString()
            });
            
            request.onsuccess = () => resolve(true);
            request.onerror = (event) => {
                console.error('Budget targets migration failed:', event.target.error);
                reject(event.target.error);
            };
        });
    }
    
    
    async loadRecentToCache() {
        try {
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            const monthKey = this.getMonthKeyFromDate(sixMonthsAgo);
            
            const recentTransactions = await this.getTransactionsByMonthRange(monthKey);
            
            if (recentTransactions.length > 0) {
                localStorage.setItem('fin_cache_recent', JSON.stringify(recentTransactions));
                console.log(`Cached ${recentTransactions.length} recent transactions`);
            }
        } catch (error) {
            console.warn('Failed to load recent transactions to cache:', error);
        }
    }


        setSaveToLocalEnabled(enabled) {
            this.saveToLocalEnabled = enabled;
            console.log(`💾 FinanceDB save to local: ${enabled}`);
        }
    
    
    async saveTransaction(transaction) {
    await this.ensureInitialized();
    
    try {
        if (!transaction.id) {
            transaction.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        }
        
        if (!transaction.monthKey && transaction.date) {
            transaction.monthKey = this.getMonthKeyFromDate(transaction.date);
        }
        
        let savedToIndexedDB = false;
        let savedToLocalStorage = false;
        
        if (this.saveToLocalEnabled) {
            if (this.db) {
                savedToIndexedDB = await this.saveToIndexedDB('transactions', transaction);
            }
            
            savedToLocalStorage = this.saveToLocalStorageCache(transaction);
            
            this.updateInMemoryTransactions(transaction);
            
            console.log('✅ บันทึกลงเครื่องแล้ว (IndexedDB + localStorage)');
        } else {
            console.log('⏭️ ข้ามการบันทึกในเครื่อง (บันทึกเฉพาะ MySQL)');
            
            this.updateInMemoryTransactions(transaction);
            
            savedToIndexedDB = true;
            savedToLocalStorage = true;

        console.log('⏭️ ข้ามการบันทึกในเครื่อง (บันทึกเฉพาะ MySQL)');
        this.updateInMemoryTransactions(transaction);
        }
        
        return {
            success: (this.saveToLocalEnabled ? (savedToIndexedDB || savedToLocalStorage) : true),
            indexedDB: savedToIndexedDB,
            localStorage: savedToLocalStorage,
            id: transaction.id,
            savedToLocal: this.saveToLocalEnabled
        };
        
    } catch (error) {
        console.error('Failed to save transaction:', error);
        
        if (this.saveToLocalEnabled) {
            const fallbackResult = this.saveToLocalStorageFallback(transaction);
            return {
                success: fallbackResult,
                indexedDB: false,
                localStorage: fallbackResult,
                id: transaction.id,
                fallback: true,
                savedToLocal: this.saveToLocalEnabled
            };
        }
        
        return {
            success: false,
            error: error.message,
            savedToLocal: this.saveToLocalEnabled
        };
    }
}
    
async getTransactionsByMonth(monthKey) {
    await this.ensureInitialized();
    
    try {
        if (transactions && transactions.length > 0) {
            return transactions.filter(t => t.monthKey === monthKey);
        }
        
        if (this.db) {
            const allTransactions = await this.getAllFromIndexedDB('transactions');
            return allTransactions.filter(t => t.monthKey === monthKey);
        }
        
        return [];
        
    } catch (error) {
        console.error('Failed to get transactions:', error);
        return [];
    }
}
    
    async getAllTransactions() {
        await this.ensureInitialized();
        
        try {
            if (this.db) {
                return await this.getAllFromIndexedDB('transactions');
            } else {
                return this.getFromLocalStorageFallback();
            }
        } catch (error) {
            console.error('Failed to get all transactions:', error);
            return this.getFromLocalStorageFallback();
        }
    }
    
async deleteTransaction(id) {
    await this.ensureInitialized();
    
    try {
        let deletedFromIndexedDB = false;
        let deletedFromLocalStorage = false;
        
        if (this.saveToLocalEnabled) {
            if (this.db) {
                try {
                    const transaction = this.db.transaction(['transactions'], 'readwrite');
                    const store = transaction.objectStore('transactions');
                    const request = store.delete(id);
                    
                    deletedFromIndexedDB = await new Promise((resolve, reject) => {
                        request.onsuccess = () => resolve(true);
                        request.onerror = (event) => {
                            console.error('Failed to delete from IndexedDB:', event.target.error);
                            reject(event.target.error);
                        };
                    });
                } catch (indexedDBError) {
                    console.warn('IndexedDB delete failed:', indexedDBError);
                }
            }
            
            try {
                const allTransactions = this.getFromLocalStorageFallback();
                const transactionToDelete = allTransactions.find(t => t.id === id);
                
                if (transactionToDelete && transactionToDelete.monthKey) {
                    const cacheKey = `fin_cache_${transactionToDelete.monthKey}`;
                    const cached = JSON.parse(localStorage.getItem(cacheKey) || '[]');
                    const filtered = cached.filter(t => t.id !== id);
                    localStorage.setItem(cacheKey, JSON.stringify(filtered));
                }
                
                const filteredAll = allTransactions.filter(t => t.id !== id);
                localStorage.setItem('fin_tx_v5', JSON.stringify(filteredAll));
                
                deletedFromLocalStorage = true;
            } catch (localStorageError) {
                console.warn('LocalStorage delete failed:', localStorageError);
            }
        } else {
            console.log('⏭️ ข้ามการลบในเครื่อง (ลบเฉพาะ MySQL)');
            deletedFromIndexedDB = true;
            deletedFromLocalStorage = true;
        }
        
        return {
            success: (this.saveToLocalEnabled ? (deletedFromIndexedDB || deletedFromLocalStorage) : true),
            indexedDB: deletedFromIndexedDB,
            localStorage: deletedFromLocalStorage,
            id: id,
            savedToLocal: this.saveToLocalEnabled
        };
        
    } catch (error) {
        console.error('Failed to delete transaction:', error);
        return {
            success: false,
            error: error.message
        };
    }
}
    
    
    async saveCategories(categories) {
        await this.ensureInitialized();
        
        try {
            let savedToIndexedDB = false;
            
            if (this.db) {
                savedToIndexedDB = await this.saveToIndexedDB('categories', {
                    id: 'custom_categories',
                    data: categories,
                    updatedAt: new Date().toISOString()
                });
            }
            
            localStorage.setItem('fin_custom_cats', JSON.stringify(categories));
            
            return {
                success: true,
                indexedDB: savedToIndexedDB,
                localStorage: true
            };
            
        } catch (error) {
            console.error('Failed to save categories:', error);
            
            localStorage.setItem('fin_custom_cats', JSON.stringify(categories));
            return {
                success: true,
                indexedDB: false,
                localStorage: true,
                fallback: true
            };
        }
    }
    
    async loadCategories() {
        await this.ensureInitialized();
        
        try {
            if (this.db) {
                const categoriesDoc = await this.getFromIndexedDB('categories', 'custom_categories');
                if (categoriesDoc && categoriesDoc.data) {
                    return categoriesDoc.data;
                }
            }
            
            const legacyCategories = JSON.parse(localStorage.getItem('fin_custom_cats') || 'null');
            if (legacyCategories) {
                return legacyCategories;
            }
            
            return defaultCategories;
            
        } catch (error) {
            console.error('Failed to load categories:', error);
            const legacyCategories = JSON.parse(localStorage.getItem('fin_custom_cats') || 'null');
            return legacyCategories || defaultCategories;
        }
    }
    
    
    async saveBudgetTargets(targets) {
        await this.ensureInitialized();
        
        try {
            let savedToIndexedDB = false;
            
            if (this.db) {
                savedToIndexedDB = await this.saveToIndexedDB('budgets', {
                    id: 'budget_targets',
                    data: targets,
                    updatedAt: new Date().toISOString()
                });
            }
            
            localStorage.setItem('fin_targets_v5', JSON.stringify(targets));
            
            return {
                success: true,
                indexedDB: savedToIndexedDB,
                localStorage: true
            };
            
        } catch (error) {
            console.error('Failed to save budget targets:', error);
            
            localStorage.setItem('fin_targets_v5', JSON.stringify(targets));
            return {
                success: true,
                indexedDB: false,
                localStorage: true,
                fallback: true
            };
        }
    }
    
    async loadBudgetTargets() {
        await this.ensureInitialized();
        
        try {
            if (this.db) {
                const targetsDoc = await this.getFromIndexedDB('budgets', 'budget_targets');
                if (targetsDoc && targetsDoc.data) {
                    return targetsDoc.data;
                }
            }
            
            const legacyTargets = JSON.parse(localStorage.getItem('fin_targets_v5') || '{}');
            return legacyTargets;
            
        } catch (error) {
            console.error('Failed to load budget targets:', error);
            return JSON.parse(localStorage.getItem('fin_targets_v5') || '{}');
        }
    }
    
    
    async ensureInitialized() {
        if (!this.initialized) {
            await this.init();
        }
    }
    
    getMonthKeyFromDate(dateString) {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }
    
    async getMetadata(key) {
        if (!this.db) return null;
        
        try {
            const doc = await this.getFromIndexedDB('metadata', key);
            return doc ? doc.value : null;
        } catch (error) {
            console.warn('Failed to get metadata:', error);
            return null;
        }
    }
    
    async setMetadata(key, value) {
        if (!this.db) return false;
        
        try {
            await this.saveToIndexedDB('metadata', {
                key: key,
                value: value,
                updatedAt: new Date().toISOString()
            });
            return true;
        } catch (error) {
            console.warn('Failed to set metadata:', error);
            return false;
        }
    }
    
    
    async saveToIndexedDB(storeName, data) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                resolve(false);
                return;
            }
            
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            
            const request = store.put(data);
            
            request.onsuccess = () => resolve(true);
            request.onerror = (event) => {
                console.error('Failed to save to IndexedDB:', event.target.error);
                reject(event.target.error);
            };
        });
    }
    
    async getFromIndexedDB(storeName, key) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                resolve(null);
                return;
            }
            
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            
            const request = store.get(key);
            
            request.onsuccess = (event) => resolve(event.target.result);
            request.onerror = (event) => {
                console.error('Failed to get from IndexedDB:', event.target.error);
                reject(event.target.error);
            };
        });
    }
    
    async deleteFromIndexedDB(storeName, key) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                resolve(false);
                return;
            }
            
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            
            const request = store.delete(key);
            
            request.onsuccess = () => resolve(true);
            request.onerror = (event) => {
                console.error('Failed to delete from IndexedDB:', event.target.error);
                reject(event.target.error);
            };
        });
    }
    
    async queryIndexedDB(storeName, indexName, value) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                resolve([]);
                return;
            }
            
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const index = store.index(indexName);
            
            const request = index.getAll(value);
            
            request.onsuccess = (event) => resolve(event.target.result || []);
            request.onerror = (event) => {
                console.error('Failed to query IndexedDB:', event.target.error);
                reject(event.target.error);
            };
        });
    }
    
    async getAllFromIndexedDB(storeName) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                resolve([]);
                return;
            }
            
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            
            const request = store.getAll();
            
            request.onsuccess = (event) => resolve(event.target.result || []);
            request.onerror = (event) => {
                console.error('Failed to get all from IndexedDB:', event.target.error);
                reject(event.target.error);
            };
        });
    }
    
    async getTransactionsByMonthRange(startMonthKey, endMonthKey = null) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                resolve([]);
                return;
            }
            
            const transaction = this.db.transaction(['transactions'], 'readonly');
            const store = transaction.objectStore('transactions');
            const index = store.index('monthKey');
            
            let range;
            if (endMonthKey) {
                range = IDBKeyRange.bound(startMonthKey, endMonthKey);
            } else {
                range = IDBKeyRange.lowerBound(startMonthKey);
            }
            
            const request = index.getAll(range);
            
            request.onsuccess = (event) => resolve(event.target.result || []);
            request.onerror = (event) => {
                console.error('Failed to get transactions by range:', event.target.error);
                reject(event.target.error);
            };
        });
    }
    
    
    saveToLocalStorageCache(transaction) {
    if (!this.saveToLocalEnabled) {
        console.log('⏭️ ข้ามการบันทึก cache (saveToLocalEnabled = false)');
        return true;
    }
    
    try {
        const cacheKey = `fin_cache_${transaction.monthKey}`;
        const cached = JSON.parse(localStorage.getItem(cacheKey) || '[]');
        
        const filtered = cached.filter(t => t.id !== transaction.id);
        
        filtered.push(transaction);
        
        localStorage.setItem(cacheKey, JSON.stringify(filtered));
        
        const allTransactions = this.getFromLocalStorageFallback();
        const existingIndex = allTransactions.findIndex(t => t.id === transaction.id);
        
        if (existingIndex >= 0) {
            allTransactions[existingIndex] = transaction;
        } else {
            allTransactions.unshift(transaction);
        }
        
        const limited = allTransactions.slice(0, 1000);
        localStorage.setItem('fin_tx_v5', JSON.stringify(limited));
        
        return true;
    } catch (error) {
        console.error('Failed to save to LocalStorage cache:', error);
        return false;
    }
}
    
    getFromLocalStorageCache(monthKey) {
        try {
            const cacheKey = `fin_cache_${monthKey}`;
            return JSON.parse(localStorage.getItem(cacheKey) || '[]');
        } catch (error) {
            console.error('Failed to get from LocalStorage cache:', error);
            return [];
        }
    }
    
    cacheTransactions(monthKey, transactions) {
        try {
            const cacheKey = `fin_cache_${monthKey}`;
            localStorage.setItem(cacheKey, JSON.stringify(transactions));
            return true;
        } catch (error) {
            console.error('Failed to cache transactions:', error);
            return false;
        }
    }
    
    deleteFromLocalStorageCache(id) {
        try {
            const allTransactions = this.getFromLocalStorageFallback();
            const transaction = allTransactions.find(t => t.id === id);
            
            if (transaction && transaction.monthKey) {
                const cacheKey = `fin_cache_${transaction.monthKey}`;
                const cached = JSON.parse(localStorage.getItem(cacheKey) || '[]');
                const filtered = cached.filter(t => t.id !== id);
                localStorage.setItem(cacheKey, JSON.stringify(filtered));
            }
            
            const filteredAll = allTransactions.filter(t => t.id !== id);
            localStorage.setItem('fin_tx_v5', JSON.stringify(filteredAll));
            
            return true;
        } catch (error) {
            console.error('Failed to delete from LocalStorage cache:', error);
            return false;
        }
    }

    removeFromLocalStorageCache(id) {
    if (!this.saveToLocalEnabled) {
        console.log('⏭️ ข้ามการลบ cache (saveToLocalEnabled = false)');
        return true;
    }
    
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('fin_cache_')) {
                const cached = JSON.parse(localStorage.getItem(key) || '[]');
                const filtered = cached.filter(t => t.id !== id);
                localStorage.setItem(key, JSON.stringify(filtered));
            }
        }
        
        const allTransactions = this.getFromLocalStorageFallback();
        const filtered = allTransactions.filter(t => t.id !== id);
        localStorage.setItem('fin_tx_v5', JSON.stringify(filtered));
        
        console.log(`🗑️ ลบ transaction id ${id} จาก LocalStorage แล้ว`);
        return true;
    } catch (error) {
        console.error('Failed to remove from LocalStorage cache:', error);
        return false;
    }
}
    
    saveToLocalStorageFallback(transaction) {
    if (!this.saveToLocalEnabled) {
        console.log('⏭️ ข้ามการบันทึก fallback (saveToLocalEnabled = false)');
        return true;
    }
    
    try {
        const allTransactions = this.getFromLocalStorageFallback();
        const existingIndex = allTransactions.findIndex(t => t.id === transaction.id);
        
        if (existingIndex >= 0) {
            allTransactions[existingIndex] = transaction;
        } else {
            allTransactions.unshift(transaction);
        }
        
        const limited = allTransactions.slice(0, 1000);
        localStorage.setItem('fin_tx_v5', JSON.stringify(limited));
        
        return true;
    } catch (error) {
        console.error('Failed to save to LocalStorage fallback:', error);
        return false;
    }
}
    
    getFromLocalStorageFallback() {
        try {
            return JSON.parse(localStorage.getItem('fin_tx_v5') || '[]');
        } catch (error) {
            console.error('Failed to get from LocalStorage fallback:', error);
            return [];
        }
    }
    
    
    updateInMemoryTransactions(transaction) {
    if (!this.saveToLocalEnabled) {
        console.log('⏭️ ข้ามการอัปเดต in-memory (saveToLocalEnabled = false)');
        return;
    }
    
    const index = transactions.findIndex(t => t.id === transaction.id);
    if (index >= 0) {
        transactions[index] = transaction;
    } else {
        transactions.unshift(transaction);
    }
}
    
    removeFromInMemoryTransactions(id) {
        transactions = transactions.filter(t => t.id !== id);
    }
    
    
    async getDatabaseInfo() {
        await this.ensureInitialized();
        
        try {
            let indexedDBSize = 0;
            let indexedDBCount = 0;
            let localStorageSize = 0;
            let localStorageCount = 0;
            
            if (this.db) {
                const allTransactions = await this.getAllFromIndexedDB('transactions');
                indexedDBCount = allTransactions.length;
                indexedDBSize = new Blob([JSON.stringify(allTransactions)]).size;
            }
            
            const lsTransactions = this.getFromLocalStorageFallback();
            localStorageCount = lsTransactions.length;
            localStorageSize = new Blob([JSON.stringify(lsTransactions)]).size;
            
            const migrationDone = await this.getMetadata('migration_v1_done');
            const migrationDate = await this.getMetadata('migration_date');
            
            return {
                indexedDB: {
                    supported: !!this.db,
                    transactionCount: indexedDBCount,
                    estimatedSize: indexedDBSize,
                    status: this.db ? 'connected' : 'not supported'
                },
                localStorage: {
                    transactionCount: localStorageCount,
                    estimatedSize: localStorageSize,
                    cacheKeys: this.getCacheKeys().length
                },
                migration: {
                    done: !!migrationDone,
                    date: migrationDate,
                    source: 'fin_tx_v5'
                },
                initialized: this.initialized
            };
            
        } catch (error) {
            console.error('Failed to get database info:', error);
            return {
                error: error.message
            };
        }
    }
    
    getCacheKeys() {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('fin_cache_')) {
                keys.push(key);
            }
        }
        return keys;
    }
    
    async clearCache() {
        try {
            const cacheKeys = this.getCacheKeys();
            cacheKeys.forEach(key => localStorage.removeItem(key));
            
            localStorage.removeItem('fin_cache_recent');
            
            console.log(`Cleared ${cacheKeys.length} cache keys`);
            return { success: true, cleared: cacheKeys.length };
        } catch (error) {
            console.error('Failed to clear cache:', error);
            return { success: false, error: error.message };
        }
    }
    
async exportFullData() {
    await this.ensureInitialized();
    
    try {
        const transactions = await this.getAllTransactions();
        const categories = await this.loadCategories();
        const budgets = await this.loadBudgetTargets();
        
        const accounts = JSON.parse(localStorage.getItem('fin_accounts') || '[]');
        const debts = JSON.parse(localStorage.getItem('fin_debts') || '[]');
        const payments = JSON.parse(localStorage.getItem('fin_debt_payments') || '[]');
        
        const exportData = {
            version: '3.0',
            exportedAt: new Date().toISOString(),
            source: 'FinanceDB Full Export',
            data: {
                transactions,
                categories,
                budgets,
                accounts,
                debts,
                payments
            },
            metadata: {
                transactionCount: transactions.length,
                categoryCount: Object.keys(categories).reduce((sum, key) => sum + categories[key].length, 0),
                budgetMonthCount: Object.keys(budgets).length,
                accountsCount: accounts.length,
                debtsCount: debts.length,
                paymentsCount: payments.length
            }
        };
        
        return exportData;
        
    } catch (error) {
        console.error('Failed to export full data:', error);
        throw error;
    }
}
    
    async importData(data) {
        await this.ensureInitialized();
        
        try {
            if (!data.version || !data.data) {
                throw new Error('Invalid data format');
            }
            
            let importedCount = 0;
            
            if (data.data.transactions && Array.isArray(data.data.transactions)) {
                for (const tx of data.data.transactions) {
                    await this.saveTransaction(tx);
                    importedCount++;
                }
            }
            
            if (data.data.categories) {
                await this.saveCategories(data.data.categories);
            }
            
            if (data.data.budgets) {
                await this.saveBudgetTargets(data.data.budgets);
            }
            
            return {
                success: true,
                imported: importedCount,
                message: `Imported ${importedCount} transactions`
            };
            
        } catch (error) {
            console.error('Failed to import data:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}


const financeDB = new FinanceDB();

financeDB.init().then(success => {
    if (success) {
        console.log('🎉 FinanceDB ready with IndexedDB!');
        loadInitialData();
    } else {
        console.warn('⚠️ FinanceDB running in fallback mode (localStorage only)');
        loadInitialData();
    }
});




// ใน function loadInitialData() หรือที่เรียกตอน refresh
async function loadInitialData() {
    console.log('🚀 loadInitialData START, isLoggedIn =', isLoggedIn);
    console.log('🔑 currentUser:', currentUser);
    
    try {
        if (isLoggedIn && navigator.onLine) {
            // ✅ โหลดทุกอย่างพร้อมกัน และรอให้เสร็จทั้งหมด
            await Promise.all([
                loadAccountsFromBackend(),
                loadCategoriesFromBackend(),
                loadTransactionsFromBackend(),
                loadDebtsFromBackend(),
                loadPaymentsFromBackend()      // ✅ สำคัญ! ต้องมี
            ]);
            
            transactions = backendTransactions;
        } else {
            const loadedTransactions = await financeDB.getAllTransactions();
            
            if (isLoggedIn) {
                transactions = loadedTransactions.filter(t => 
                    t.owner_type === 'user' && t.owner_id === currentUser.id
                );
            } else {
                const guestId = getGuestId();
                transactions = loadedTransactions.filter(t => 
                    t.owner_type === 'guest' && t.owner_id === guestId
                );
            }
            
            // ✅ Guest mode: ล้างข้อมูลหนี้
            debts = [];
            payments = [];
        }
        
        const loadedTargets = await financeDB.loadBudgetTargets();
        categoryTargets = loadedTargets;

        updateAccountSelect();
        updateMobileAccountSelect();
        updateCategorySelect();
        
        console.log(`📊 Loaded ${transactions.length} transactions`);
        console.log(`📊 Loaded ${debts.length} debts`);
        console.log(`📊 Loaded ${payments.length} payments`);  // ✅ เพิ่ม debug
        
        // ✅ อัปเดต UI ครั้งเดียว หลังจากโหลดข้อมูลเสร็จ
        updateUI();
        renderCalendar();
        
        const currentPage = getCurrentPage();
        if (currentPage === 'budget') {
            updateBudgetUI();
        } else if (currentPage === 'analysis') {
            refreshAnalysisCharts();
        } else if (currentPage === 'yearly') {
            updateYearlyUI();
        } else if (currentPage === 'debt') {
            renderDebtPage();  // ✅ ตอนนี้ payments มีข้อมูลแล้ว
        } else if (currentPage === 'accounts') {
            renderAccountsList();
        }
        
    } catch (error) {
        console.error('Failed to load initial data:', error);
        loadFromLocalStorageFallback();
        updateUI();
    }
}

async function loadPaymentsFromBackend() {
    if (!isLoggedIn || !navigator.onLine) return [];
    
    try {
        const response = await fetch(`${API_URL}/debt-payments?user_id=${currentUser.id}`);
        
        if (!response.ok) {
            console.warn('Failed to load payments from backend, status:', response.status);
            return [];
        }
        
        const serverPayments = await response.json();
        
        console.log(`📥 โหลด ${serverPayments.length} payments จาก backend`);
        
        // ✅ เคลียร์ payments array ก่อน แล้วค่อยเพิ่มใหม่
        payments.length = 0;  // เคลียร์ array โดยไม่สร้างใหม่
        
        for (const payment of serverPayments) {
            payments.push({
                id: payment.id.toString(),
                debtId: payment.debt_id.toString(),
                accountId: payment.account_id ? payment.account_id.toString() : null,
                amount: parseFloat(payment.amount),
                date: payment.payment_date,
                note: payment.note || '',
                backendId: payment.id,
                createdAt: payment.created_at
            });
            console.log(`✅ เพิ่ม payment: ${payment.id} (${payment.amount} บาท)`);
        }
        
        // บันทึก local ตาม checkbox
        if (saveToLocalEnabled) {
            savePaymentsToStorage();
            console.log('💾 บันทึก payments ลง localStorage');
        } else {
            console.log('⏭️ ข้ามการบันทึก payments ลง localStorage (saveToLocalEnabled = false)');
        }
        
        return payments;  // ✅ return ค่าด้วย
        
    } catch (error) {
        console.error('Error loading payments:', error);
        return [];
    }
}

function loadFromLocalStorageFallback() {
    transactions = JSON.parse(localStorage.getItem('fin_tx_v5')) || [];
    customCategories = JSON.parse(localStorage.getItem('fin_custom_cats')) || defaultCategories;
    categoryTargets = JSON.parse(localStorage.getItem('fin_targets_v5')) || {};
}

async function loadAllMonthsData() {
    try {
        const allTransactions = await financeDB.getAllTransactions();
        transactions = allTransactions;
        
        console.log(`✅ โหลดข้อมูลครบ ${transactions.length} รายการ จากทุกเดือน`);
        
        updateUI();
        renderCalendar();
        
        if (!document.getElementById('page-budget').classList.contains('hidden')) {
            updateBudgetUI();
        }
        
        if (!document.getElementById('page-analysis').classList.contains('hidden')) {
            refreshAnalysisCharts();
        }
        
        if (!document.getElementById('page-yearly').classList.contains('hidden')) {
            updateYearlyUI();
        }
        
    } catch (error) {
        console.error('❌ โหลดข้อมูลไม่สำเร็จ:', error);
    }
}

function openMobileForm() {
    const form = document.getElementById('formContainer');
    form.classList.add('mobile-open');
    document.body.style.overflow = 'hidden';
    
    if (!document.getElementById('mobileCloseBtn')) {
        const closeBtn = document.createElement('button');
        closeBtn.id = 'mobileCloseBtn';
        closeBtn.innerHTML = '×';
        closeBtn.className = 'absolute top-6 right-6 text-2xl text-slate-400 z-10';
        closeBtn.onclick = closeMobileForm;
        form.prepend(closeBtn);
    }
}

function closeMobileForm() {
    const form = document.getElementById('formContainer');
    form.classList.remove('mobile-open');
    document.body.style.overflow = 'auto';
    
    const closeBtn = document.getElementById('mobileCloseBtn');
    if (closeBtn) closeBtn.remove();
}

function isMobile() {
    return window.innerWidth <= 768;
}

function getDeviceAction(transactionId) {
    if (isMobile()) {
        return `onclick="showMobileActionModal('${transactionId}')"`;
    } else {
        return `onclick="editTransaction('${transactionId}')"`;
    }
}


let isMobileMode = false;
let formInitialized = false;

function checkIsMobile() {
    return window.innerWidth <= 768;
}

function manageFormContainer() {
    console.log("🔄 manageFormContainer() called");
    
    const formContainer = document.getElementById('formContainer');
    const formPlaceholder = document.getElementById('formPlaceholder');
    const isOverviewPage = !document.getElementById('page-overview').classList.contains('hidden');
    isMobileMode = checkIsMobile();
    
    console.log("📱 isMobileMode:", isMobileMode);
    console.log("🏠 isOverviewPage:", isOverviewPage);
    
    if (isMobileMode) {
        console.log("📱 Mobile mode detected");
        
        if (formPlaceholder && formPlaceholder.contains(formContainer)) {
            console.log("↪️ Removing form from placeholder");
            formPlaceholder.removeChild(formContainer);
        }
        
        if (formContainer.parentElement.id !== 'mainContainer') {
            console.log("📦 Moving form to mainContainer");
            document.getElementById('mainContainer').appendChild(formContainer);
        }
        
        formContainer.classList.add('hidden');
        formContainer.classList.remove('lg:col-span-4', 'md:block');
        
        if (formPlaceholder) {
            formPlaceholder.style.display = 'none';
        }
        
    } else {
        console.log("💻 Desktop mode detected");
        
        if (isOverviewPage && formPlaceholder) {
            console.log("💻 Desktop + Overview - Moving form to placeholder");
            
            formPlaceholder.style.display = 'block';
            
            formContainer.classList.remove('hidden');
            formContainer.classList.add('lg:col-span-4', 'md:block');
            
            if (!formPlaceholder.contains(formContainer)) {
                console.log("📥 Moving form into placeholder");
                formPlaceholder.appendChild(formContainer);
            }
            
            formContainer.classList.remove('mobile-open');
            
        } else {
            console.log("💻 Desktop + Other page - Hiding form");
            
            formContainer.classList.add('hidden');
            
            if (formPlaceholder && formPlaceholder.contains(formContainer)) {
                console.log("📤 Removing form from placeholder");
                formPlaceholder.removeChild(formContainer);
                document.getElementById('mainContainer').appendChild(formContainer);
            }
            
            if (formPlaceholder) {
                formPlaceholder.style.display = 'none';
            }
        }
    }
    
    formInitialized = true;
    console.log("✅ Form management completed");
}


function openMobileForm() {
    console.log("📱 openMobileForm() called");
    
    if (!isMobileMode) {
        console.warn("⚠️ This function should only be called on mobile");
        return;
    }
    
    const form = document.getElementById('formContainer');
    
    form.classList.add('mobile-open');
    form.classList.remove('hidden');
    
    document.body.style.overflow = 'hidden';
    
    if (!document.getElementById('mobileCloseBtn')) {
        console.log("➕ Adding close button");
        const closeBtn = document.createElement('button');
        closeBtn.id = 'mobileCloseBtn';
        closeBtn.innerHTML = '×';
        closeBtn.className = 'absolute top-4 right-4 text-2xl text-slate-400 z-10';
        closeBtn.onclick = closeMobileForm;
        
        const formInner = form.querySelector('div');
        if (formInner) {
            formInner.style.position = 'relative';
            formInner.appendChild(closeBtn);
        }
    }
    
    setTimeout(() => {
        const amountInput = document.getElementById('amount');
        if (amountInput) amountInput.focus();
    }, 300);
    
    console.log("✅ Mobile form opened");
}

function closeMobileForm() {
    console.log("📱 closeMobileForm() called");
    
    const form = document.getElementById('formContainer');
    
    form.classList.remove('mobile-open');
    
    document.body.style.overflow = 'auto';
    
    const closeBtn = document.getElementById('mobileCloseBtn');
    if (closeBtn) {
        closeBtn.remove();
    }
    
    if (!editingTxId) {
        resetForm();
    }
    
    console.log("✅ Mobile form closed");
}




window.addEventListener('resize', function() {
    console.log("🖥️ Window resized");
    manageFormContainer();
    
    setTimeout(() => {
        updateCopyBudgetButtonText();
    }, 300); 
});

window.addEventListener('load', function() {
    console.log("🚀 Page loaded, initializing...");
    
    console.log("🚀 Page loaded, initializing form...");
    setTimeout(() => {
        manageFormContainer();
        
        const currentPage = getCurrentPage();
        console.log("📄 Current page on load:", currentPage);
    }, 200);
    
    setTimeout(() => {
        const accountsPage = document.getElementById('page-accounts');
        if (accountsPage && !accountsPage.classList.contains('hidden')) {
            console.log("📱 เปิดหน้า accounts มาครั้งแรก, เรียก initTransferForm()");
            initTransferForm();
        }
    }, 1000); 
});

let selectedTransaction = null;
let mobileFormState = {
    type: 'expense',           
    amount: 0,                 
    category: null,            
    categoryLabel: '',         
    note: '',                  
    date: new Date().toISOString().split('T')[0], 
    editingId: null            
};



function showMobileActionModal(transactionId) {
    if (!isMobile()) return;
    
    try {
        let transaction = findTransactionById(transactionId);
        
        if (!transaction) {
            console.error('Transaction not found:', transactionId);
            return;
        }
        
        window.selectedTransaction = transaction;
        
        const desc = document.getElementById('actionItemDesc');
        if (desc) {
            const tag = transaction.tag ? `[${transaction.tag}] ` : '';
            desc.textContent = `${tag}${transaction.desc} - ฿${transaction.amount.toLocaleString()}`;
        }
        
        document.getElementById('mobileActionModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
    } catch (error) {
        console.error('Error in showMobileActionModal:', error);
        showToast("❌ ไม่สามารถแสดงรายการนี้ได้");
    }
}

function closeMobileActionModal() {
    selectedTransaction = null;
    document.getElementById('mobileActionModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}


function openMobileForm(editTransaction = null) {
    console.log("📱 เปิด Mobile Form");
    
    if (editTransaction) {
        loadTransactionToMobileForm(editTransaction);
    } else {
        resetMobileForm();
    }

    updateMobileAccountSelect();
    
    // ✅ ถ้ามีการแก้ไข transaction ให้ set ค่า account select
    if (editTransaction && editTransaction.accountId) {
        const mobileSelect = document.getElementById('mobileAccountSelect');
        if (mobileSelect) {
            mobileSelect.value = editTransaction.accountId;
            mobileFormState.accountId = editTransaction.accountId;
        }
    }
    
    setMobileType(mobileFormState.type);
    
    document.getElementById('mobileFormContainer').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    renderMobileCategories();
    
    document.getElementById('mobileDateInput').value = mobileFormState.date;
    updateMobileDateDisplay();

    if (!editTransaction) {
        const tagInput = document.getElementById('mobileTag');
        if (tagInput) tagInput.value = '';
    }
}

function updateMobileAccountSelect() {
    const mobileSelect = document.getElementById('mobileAccountSelect');
    if (!mobileSelect) return;
    
    console.log('🔄 Updating mobile account select, accounts:', accounts.length);
    
    if (accounts.length === 0) {
        mobileSelect.innerHTML = '<option value="">-- ไม่มีบัญชี --</option>';
        return;
    }
    
    // ✅ สร้าง options จาก accounts
    let optionsHTML = '';
    accounts.forEach(acc => {
        const balance = getAccountBalance(acc.id);
        const selected = (acc.id === currentAccountId) ? 'selected' : '';
        optionsHTML += `
            <option value="${acc.id}" ${selected}>
                ${acc.icon} ${acc.name} (฿${balance.toLocaleString()})
            </option>
        `;
    });
    
    mobileSelect.innerHTML = optionsHTML;
    
    // ✅ ตรวจสอบว่า currentAccountId อยู่ใน dropdown หรือไม่
    if (currentAccountId && !accounts.some(a => a.id === currentAccountId)) {
        // ถ้าไม่เจอ ให้เลือกตัวแรก
        if (accounts.length > 0) {
            mobileSelect.value = accounts[0].id;
            console.log('📌 currentAccountId not found, using first account:', accounts[0].id);
        }
    } else if (currentAccountId) {
        mobileSelect.value = currentAccountId;
    }
    
    console.log('✅ Mobile account select updated, selected:', mobileSelect.value);
}

function closeMobileForm() {
    document.getElementById('mobileFormContainer').classList.add('hidden');
    document.body.style.overflow = 'auto';
    resetMobileForm();
}

function resetMobileForm() {
    mobileFormState = {
        type: 'expense',
        amount: 0,
        category: null,
        categoryLabel: '',
        note: '',
        tag: '',
        date: new Date().toISOString().split('T')[0], 
        editingId: null,
        isDebtPayment: false, 
        originalPaymentId: null 
    };
    
    updateMobileAmountDisplay();
    document.getElementById('mobileNote').value = '';
    setMobileType('expense');

    updateMobileDateDisplay();
    
    document.querySelectorAll('.mobile-category-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    
    // ✅ ไม่ต้องรีเซ็ต mobileAccountSelect ให้คงค่าเดิม
    // แต่ถ้าต้องการให้เลือก currentAccountId:
    const mobileSelect = document.getElementById('mobileAccountSelect');
    if (mobileSelect && currentAccountId) {
        mobileSelect.value = currentAccountId;
    }
}

function loadTransactionToMobileForm(transaction) {
    console.log('🔍 Debug transaction object:', transaction);
    console.log('🔍 Transaction has desc?:', 'desc' in transaction);
    console.log('🔍 desc value:', transaction.desc);
    console.log('🔍 desc type:', typeof transaction.desc);
    console.log('🔍 desc equals category?:', transaction.desc === transaction.category);
    console.log('🔍 Transaction keys:', Object.keys(transaction));

    const note = transaction.desc && transaction.desc !== transaction.category 
    ? transaction.desc 
    : '';
    
    console.log('🔍 Final note value:', note);

    mobileFormState = {
        type: transaction.type,
        amount: transaction.amount,
        category: null,
        categoryLabel: transaction.category,
        note: note,
        tag: transaction.tag || '',
        date: transaction.rawDate,
        editingId: transaction.id
    };
    
    if (transaction.isDebtPayment) {
        mobileFormState.isDebtPayment = true;
        mobileFormState.originalPaymentId = transaction.originalPaymentId;
        mobileFormState.originalDebtId = transaction.originalDebtId;
        console.log('💰 [Mobile] กำลังแก้ไขรายการผ่อนหนี้');
    }
    
    updateMobileAmountDisplay();
    
    const noteInput = document.getElementById('mobileNote');
    noteInput.value = mobileFormState.note;
    
    const tagInput = document.getElementById('mobileTag');
    if (tagInput) tagInput.value = mobileFormState.tag;

    setMobileType(transaction.type);
    updateMobileDateDisplay();
    
    setTimeout(() => {
        selectMobileCategoryByLabel(transaction.category);
    }, 100);
}

function setMobileType(type) {
    mobileFormState.type = type;
    
    const incomeBtn = document.getElementById('mobileBtnIncome');
    const expenseBtn = document.getElementById('mobileBtnExpense');
    
    if (type === 'income') {
        incomeBtn.classList.add('active');
        expenseBtn.classList.remove('active');
        incomeBtn.style.color = '#059669';
        expenseBtn.style.color = '';
    } else if (type === 'expense') {
        expenseBtn.classList.add('active');
        incomeBtn.classList.remove('active');
        expenseBtn.style.color = '#dc2626';
        incomeBtn.style.color = '';
    } else if (type === 'transfer') {
        incomeBtn.classList.remove('active');
        expenseBtn.classList.remove('active');
        incomeBtn.style.color = '';
        expenseBtn.style.color = '';
    }
    renderMobileCategories();
}


function mobileAddNumber(num) {
    let current = mobileFormState.amount.toString();
    
    if (current.includes('.')) {
        const decimalPart = current.split('.')[1] || '';
        if (decimalPart.length >= 2) {
            showMobileToast("ทศนิยมไม่เกิน 2 ตำแหน่ง");
            return;
        }
    }
    
    if (current === '0' && !current.includes('.')) {
        current = '';
    }
    
    const digits = current.replace('.', '').length;
    if (digits >= 9) {
        showMobileToast("จำนวนเงินสูงสุด 999,999,999");
        return;
    }
    
    mobileFormState.amount = current + num;
        if (!current.includes('.')) {
        mobileFormState.amount = Number(mobileFormState.amount);
    }
    updateMobileAmountDisplay();
}

function mobileClearLastDigit() {
    let current = mobileFormState.amount.toString();
    
    if (current.length <= 1) {
        mobileFormState.amount = 0;
    } else {
        mobileFormState.amount = parseInt(current.slice(0, -1));
    }
    
    updateMobileAmountDisplay();
}

function mobileAddDecimalPoint() {
    let current = mobileFormState.amount.toString();
    
    if (current.includes('.')) {
        showMobileToast("มีจุดทศนิยมอยู่แล้ว");
        return;
    }
    
    if (current.length >= 9) {
        showMobileToast("จำนวนเงินสูงสุด 9 หลัก");
        return;
    }
    
    if (current === '0' || current === '') {
        mobileFormState.amount = "0.";
    } else {
        mobileFormState.amount = current + '.';
    }
    
    updateMobileAmountDisplay();
}

function updateMobileAmountDisplay() {
    const display = document.getElementById('mobileAmountDisplay');
    if (display) {
        display.textContent = mobileFormState.amount.toLocaleString();
        
        if (mobileFormState.type === 'income') {
            display.style.color = '#059669';
        } else {
            display.style.color = '#dc2626';
        }
    }
}


function renderMobileCategories() {
    const container = document.getElementById('mobileCategoriesContainer');
    if (!container) return;
    
    let categories = [];
    if (mobileFormState.type === 'income') {
        categories = customCategories.income;
    } else {
        categories = [...customCategories.spending, ...customCategories.investment];
    }
    
    container.innerHTML = categories.map(cat => `
        <div class="mobile-category-chip ${mobileFormState.category === cat.id ? 'active' : ''}"
             onclick="selectMobileCategory('${cat.id}', '${cat.label}')"
             data-category-id="${cat.id}">
            <span class="text-xl">${cat.icon}</span>
            <span class="text-xs mt-1 whitespace-nowrap">${cat.label}</span>
        </div>
    `).join('');
    
    if (mobileFormState.category) {
        const selectedChip = container.querySelector(`[data-category-id="${mobileFormState.category}"]`);
        if (selectedChip) {
            selectedChip.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }
    }
}

function selectMobileCategory(categoryId, categoryLabel) {
    mobileFormState.category = categoryId;
    mobileFormState.categoryLabel = categoryLabel;
    
    document.querySelectorAll('.mobile-category-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    
    const selectedChip = document.querySelector(`[data-category-id="${categoryId}"]`);
    if (selectedChip) {
        selectedChip.classList.add('active');
    }
    updateMobileTagSuggestions();
}

function selectMobileCategoryByLabel(label) {
    let foundCategory = null;
    
    const allCategories = [
        ...customCategories.income,
        ...customCategories.spending,
        ...customCategories.investment
    ];
    
    foundCategory = allCategories.find(cat => cat.label === label);
    
    if (foundCategory) {
        selectMobileCategory(foundCategory.id, foundCategory.label);
    }
}


function openMobileDatePicker() {
    document.getElementById('mobileDatePicker').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeMobileDatePicker() {
    const dateInput = document.getElementById('mobileDateInput');
    if (dateInput.value) {
        mobileFormState.date = dateInput.value;
        updateMobileDateDisplay();
    }
    
    document.getElementById('mobileDatePicker').classList.add('hidden');
    document.body.style.overflow = 'auto';
}


async function saveMobileTransaction() {
    const amountStr = mobileFormState.amount.toString();
    
    let amountValue;
    if (amountStr.includes('.')) {
        amountValue = parseFloat(amountStr);
    } else {
        amountValue = parseInt(amountStr, 10);
    }
    
    if (isNaN(amountValue) || amountValue === 0) {
        showMobileToast("กรุณาระบุยอดเงิน");
        return;
    }

    const tagInput = document.getElementById('mobileTag');
    const tagValue = tagInput ? tagInput.value.trim() : '';
    
    const allCats = [
        ...customCategories.income,
        ...customCategories.spending,
        ...customCategories.investment
    ];
    
    const cat = allCats.find(c => c.id === mobileFormState.category);
    if (!cat) {
        showMobileToast("ไม่พบหมวดหมู่");
        return;
    }
    
    const accountSelect = document.getElementById('mobileAccountSelect');
    let accountId = accountSelect ? accountSelect.value : null;
    
    if (!accountId) {
        accountId = currentAccountId;
    }
    
    if (!accountId) {
        const defaultAccount = accounts.find(a => a.isDefault);
        accountId = defaultAccount ? defaultAccount.id : 'default_acc';
    }
    
    // ✅ ตรวจสอบให้ accountId เป็น string เสมอ
    accountId = String(accountId);
    
    // ✅ ไม่ต้องแปลง accountId เป็น number หรือ null
    // ส่ง string ตรงๆ ไป backend
    
    const saveToLocalCheckbox = document.getElementById('mobileSaveToLocalCheckbox');
    const saveToLocalEnabled = saveToLocalCheckbox ? saveToLocalCheckbox.checked : true;
    
    const isUpdate = !!mobileFormState.editingId;
    
    const transaction = {
        id: mobileFormState.editingId || Date.now().toString() + Math.random().toString(36).substr(2, 9),
        amount: amountValue,
        type: mobileFormState.type,
        category: cat.label,
        icon: cat.icon,
        desc: mobileFormState.note.trim() !== '' 
            ? mobileFormState.note.trim() 
            : mobileFormState.categoryLabel,
        tag: tagValue,
        rawDate: mobileFormState.date,
        monthKey: `${new Date(mobileFormState.date).getFullYear()}-${String(new Date(mobileFormState.date).getMonth() + 1).padStart(2, '0')}`,
        date: mobileFormState.date,
        accountId: accountId,  // ✅ เป็น string เสมอ
        createdAt: mobileFormState.editingId ? undefined : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner_type: isLoggedIn ? 'user' : 'guest',
        owner_id: isLoggedIn ? currentUser.id : getGuestId()
    };
    
    if (mobileFormState.editingId && mobileFormState.isDebtPayment && mobileFormState.originalPaymentId) {
        console.log('💰 [Mobile] กำลังอัพเดตรายการผ่อนหนี้');
        
        transaction.isDebtPayment = true;
        transaction.originalPaymentId = mobileFormState.originalPaymentId;
        transaction.originalDebtId = mobileFormState.originalDebtId;
        
        const paymentIndex = payments.findIndex(p => p.id === mobileFormState.originalPaymentId);
        if (paymentIndex !== -1) {
            payments[paymentIndex] = {
                ...payments[paymentIndex],
                amount: amountValue,
                date: mobileFormState.date,
                note: mobileFormState.note.trim() || cat.label,
                updatedAt: new Date().toISOString()
            };
            
            savePaymentsToStorage();
            console.log('✅ [Mobile] อัพเดต payment record สำเร็จ');
        }
    }
    
    console.log("💾 บันทึกรายการจาก Mobile:", transaction, isUpdate ? "(แก้ไข)" : "(ใหม่)");
    
    try {
        let result = { success: true }; 
        let backendId = null;
        
        if (isLoggedIn) {
            if (navigator.onLine) {
                console.log('🌐 Online - บันทึก MySQL');
                let backendResult;
                
                // ✅ ส่ง accountId เป็น string ตรงๆ
                const backendTransaction = {
                    ...transaction,
                    accountId: accountId  // ✅ ไม่ต้องแปลง
                };
                
                if (isUpdate) {
                    backendResult = await updateTransactionInBackend(backendTransaction);
                    if (backendResult && backendResult.success) {
                        backendId = transaction.id;
                        console.log('✅ อัปเดต MySQL สำเร็จ, ID:', backendId);
                    }
                } else {
                    backendResult = await saveTransactionToBackend(backendTransaction);
                    if (backendResult && backendResult.id) {
                        backendId = backendResult.id;
                        transaction.id = backendId.toString();
                        transaction.backendId = backendId;
                        console.log('✅ บันทึก MySQL สำเร็จ, ID:', backendId);
                    }
                }
            } 
            else {
                console.log('📱 Offline - ใส่คิวรอซิงค์');
                addToSyncQueue(transaction, isUpdate ? 'update' : 'create');
                showToast('📦 ออฟไลน์: รอซิงค์อัตโนมัติ', 'info');
            }
            
            if (saveToLocalEnabled) {
                console.log('💾 บันทึกในเครื่อง (ตาม checkbox)');
                const localTransaction = {
                    ...transaction,
                    accountId: accountId  // ✅ string
                };
                result = await financeDB.saveTransaction(localTransaction);
            } else {
                console.log('⏭️ ข้ามการบันทึกในเครื่อง (checkbox ไม่ติ๊ก)');
                result.success = true; 
            }
        } 
        else {
            console.log('👤 Guest mode - บันทึกในเครื่อง');
            const localTransaction = {
                ...transaction,
                accountId: accountId  // ✅ string
            };
            result = await financeDB.saveTransaction(localTransaction);
        }
        
        if (result.success) {
            const displayTransaction = {
                ...transaction,
                accountId: accountId  // ✅ string
            };
            
            if (saveToLocalEnabled) {
                if (isUpdate) {
                    const existingIndex = transactions.findIndex(t => t.id === mobileFormState.editingId);
                    if (existingIndex !== -1) {
                        transactions[existingIndex] = displayTransaction;
                    }
                } else {
                    const exists = transactions.some(t => t.id === displayTransaction.id);
                    if (!exists) {
                        transactions.unshift(displayTransaction);
                    }
                }
                console.log('✅ อัปเดต transactions array แล้ว');
            } else {
                console.log('⏭️ ข้ามการอัปเดต transactions array (checkbox ไม่ติ๊ก)');
                
                if (isUpdate) {
                    const index = transactions.findIndex(t => t.id === mobileFormState.editingId);
                    if (index !== -1) {
                        transactions[index] = displayTransaction;
                    }
                }
            }
            
            if (saveToLocalEnabled) {
                try {
                    localStorage.setItem('fin_tx_v5', JSON.stringify(transactions.slice(0, 1000)));
                    
                    const cacheKey = `fin_cache_${displayTransaction.monthKey}`;
                    const monthTransactions = transactions.filter(t => t.monthKey === displayTransaction.monthKey);
                    localStorage.setItem(cacheKey, JSON.stringify(monthTransactions));
                    
                    console.log('✅ อัปเดต LocalStorage cache สำเร็จ');
                } catch (cacheError) {
                    console.warn('⚠️ อัปเดต LocalStorage cache ไม่สำเร็จ:', cacheError);
                }
            } else {
                console.log('⏭️ ข้ามการอัปเดต localStorage (checkbox ไม่ติ๊ก)');
            }
            
            if (isLoggedIn && navigator.onLine) {
                console.log('🔄 โหลดข้อมูลจาก backend ใหม่...');
                await loadTransactionsFromBackend();
                isShowingBackendData = true;
            }
            
            closeMobileForm();
            
            updateUI();
            refreshAnalysisCharts();
            
            if (!document.getElementById('page-budget').classList.contains('hidden')) {
                updateBudgetUI();
            }
            
            if (!document.getElementById('page-yearly').classList.contains('hidden')) {
                updateYearlyUI();
            }
            
            const isCalendarTabActive = !document.getElementById('overview-calendar-content').classList.contains('hidden');
            if (isCalendarTabActive) {
                renderCalendar();
            }
            
            let toastMsg = isUpdate ? "✏️ แก้ไขสำเร็จ" : "✅ บันทึกสำเร็จ";
            if (mobileFormState.isDebtPayment) {
                toastMsg = "💰 อัพเดตการผ่อนหนี้สำเร็จ";
            }
            
            if (!saveToLocalEnabled && isLoggedIn) {
                toastMsg += " (เฉพาะ MySQL)";
            } else if (!navigator.onLine && isLoggedIn) {
                toastMsg += " (รอซิงค์)";
            }
            
            showToast(toastMsg);
            
        } else {
            showToast("❌ บันทึกไม่สำเร็จ");
        }
        
    } catch (error) {
        console.error('Error saving mobile transaction:', error);
        showToast("❌ บันทึกไม่สำเร็จ: " + error.message);
    }
}

function showMobileToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-bold z-[300]';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 2000);
}

function editFromMobileAction() {
    if (!window.selectedTransaction) return;
    
    closeDayDetailModal();
    
    closeMobileActionModal();
    
    openMobileForm(window.selectedTransaction);
    
    window.selectedTransaction = null;
}

async function deleteFromMobileAction() {
    if (!window.selectedTransaction) return;
    
    const id = window.selectedTransaction.id;
    const transaction = window.selectedTransaction; 

    console.log('🗑️ deleteFromMobileAction called with id:', id);
    
    const isDebtPayment = transaction.isDebtPayment;
    const originalPaymentId = transaction.originalPaymentId;
    
    closeDayDetailModal();
    closeMobileActionModal();
    
    showConfirm("ลบรายการ?", "ลบแล้วกู้คืนไม่ได้", async () => { 
        console.log('🗑️ Confirm delete for id:', id);
        try {
            await deleteTransaction(id, true);
        } catch (error) {
            console.error('Error deleting transaction:', error);
            hideConfirm();
            showToast("❌ ลบไม่สำเร็จ: " + error.message);
        }
    });
    
    window.selectedTransaction = null;
}





function getCurrentPage() {
    if (!document.getElementById('page-overview').classList.contains('hidden')) return 'overview';
    if (!document.getElementById('page-budget').classList.contains('hidden')) return 'budget';
    if (!document.getElementById('page-debt').classList.contains('hidden')) return 'debt';
    if (!document.getElementById('page-analysis').classList.contains('hidden')) return 'analysis';
    if (!document.getElementById('page-yearly').classList.contains('hidden')) return 'yearly';
    return 'overview';
}



function openMobileFormFromFab() {
    console.log("🎯 FAB clicked");
    
    if (checkIsMobile()) {
        openMobileForm();
    } else {
        const currentPage = getCurrentPage();
        if (currentPage !== 'overview') {
            switchPage('overview');
            showToast("เปลี่ยนไปหน้าการบันทึกรายการ");
        } else {
            showToast("คุณอยู่ในหน้าการบันทึกรายการแล้ว");
        }
    }
}

document.addEventListener('click', function(e) {
    if (e.target.id === 'submitBtn' || e.target.closest('#submitBtn')) {
        setTimeout(function() {
            if (isMobileMode && document.getElementById('formContainer').classList.contains('mobile-open')) {
                closeMobileForm();
            }
        }, 500); 
    }
});

document.addEventListener('touchstart', function(e) {
    if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

document.addEventListener('wheel', function(e) {
    if (e.ctrlKey) e.preventDefault();
}, { passive: false });


function updateCopyBudgetButtonText() {
    const button = document.getElementById('copyBudgetButton');
    if (!button) {
        console.log("⚠️ copyBudgetButton not found");
        return;
    }
    
    const isMobileDevice = window.innerWidth <= 768;
    
    if (isMobileDevice) {
        button.innerHTML = '📋 <br>งบเดือนก่อน';
        console.log("📱 Changed button text for mobile: 📋 งบเดือนก่อน");
    } else {
        button.innerHTML = '📋 ดึงงบจากเดือนก่อน';
        console.log("💻 Changed button text for desktop: 📋 ดึงงบจากเดือนก่อน");
    }
}

window.onload = async () => {  // ← เพิ่ม async
    console.log("=== WINDOW LOAD START ===");
    
    document.body.classList.add('dark');
    setFontSize(currentFontSize, false);
    updateMonthDisplay();
    updateCategorySelect();
    setDefaultDate();
    populateYearSelect();
    initIconGrid();

    const savedFilter = localStorage.getItem('fin_account_filter');
    if (savedFilter) {
        accountFilterId = savedFilter;
        updateAccountFilterDropdown();
    }

    setTimeout(() => {
        updateCopyBudgetButtonText();
    }, 500);

    updateAccountSelect();
    updateAccountFilterDropdown();
    
    if (financeDB) {
        financeDB.init().then(async () => {  // ← เพิ่ม async
            console.log("✅ FinanceDB พร้อมใช้งานแล้ว");
            
            // ✅ เพิ่มบรรทัดนี้: เรียกใช้ Migration
            
            fixNullAccountIds().then(() => {
                loadInitialData().then(() => {
                    updateUI();
                    renderCalendar();
                    
                    const currentPage = getCurrentPage();
                    if (currentPage === 'budget') {
                        updateBudgetUI();
                    } else if (currentPage === 'analysis') {
                        refreshAnalysisCharts();
                    } else if (currentPage === 'yearly') {
                        updateYearlyUI();
                    } else if (currentPage === 'debt') {
                        renderDebtPage();
                    } else if (currentPage === 'accounts') {
                        renderAccountsList();
                    }
                    
                    setTimeout(() => {
                        bindHistoryItemEvents();
                    }, 300);
                });
            });
        });
    }
    
    document.getElementById('mobileDateInput').value = new Date().toISOString().split('T')[0];
    
    const savedBudgetMode = localStorage.getItem('fin_budget_mode');
    if (savedBudgetMode) {
        budgetMode = savedBudgetMode;
    }
    
    setTimeout(() => {
        if (document.getElementById('budgetModePercent')) {
            setBudgetMode(budgetMode);
        }
    }, 1000);
    
    console.log("=== WINDOW LOAD END ===");
};

function bindHistoryItemEvents() {
    console.log("🔗 Binding history item events...");
    
    const historyItems = document.querySelectorAll('.history-item');
    console.log(`Found ${historyItems.length} history items to bind`);
    
    historyItems.forEach(item => {
        item.removeEventListener('click', handleHistoryItemClick);
        
        item.addEventListener('click', handleHistoryItemClick);
    });
    
    const dayDetailItems = document.querySelectorAll('#dayDetailList > div[onclick]');
    dayDetailItems.forEach(item => {
        const oldOnClick = item.getAttribute('onclick');
        if (oldOnClick && oldOnClick.includes('showMobileActionModal')) {
            item.setAttribute('data-has-click', 'true');
        }
    });
}

function handleHistoryItemClick(event) {
    console.log('🖱️ CLICKED! handleHistoryItemClick called');  // ✅ เพิ่มตรงนี้
    
    // ตรวจสอบว่าเป็น Mobile หรือไม่
    const isMobileDevice = window.innerWidth <= 768;
    console.log('📱 isMobileDevice:', isMobileDevice);
    
    if (!isMobileDevice) return;
    
    // ป้องกัน event bubbling
    event.stopPropagation();
    
    const item = event.currentTarget;
    const transactionId = item.getAttribute('data-transaction-id');
    
    console.log('🔍 Transaction ID:', transactionId);
    
    if (!transactionId) {
        console.warn('No transaction ID found');
        return;
    }
    
    // ใช้ findTransactionById แทนการหาเอง
    const transaction = findTransactionById(transactionId);
    
    if (transaction) {
        console.log('✅ Found transaction:', transaction);
        showMobileActionModal(transactionId);  // ส่ง ID ไม่ใช่ object
    } else {
        console.error('❌ Transaction not found:', transactionId);
        showToast("ไม่พบรายการนี้");
    }
}

function switchOverviewTab(tab) {
    console.log(`switchOverviewTab called with tab: ${tab}`);
    const histBtn = document.getElementById('tab-history-btn');
    const calBtn = document.getElementById('tab-calendar-btn');
    const histCont = document.getElementById('overview-history-content');
    const calCont = document.getElementById('overview-calendar-content');

    if (tab === 'history') {
        histBtn.className = "py-2 text-xs font-bold uppercase tracking-widest text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400";
        calBtn.className = "py-2 text-xs font-bold uppercase tracking-widest text-slate-400 border-b-2 border-transparent";
        histCont.classList.remove('hidden');
        calCont.classList.add('hidden');
    } else {
        calBtn.className = "py-2 text-xs font-bold uppercase tracking-widest text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400";
        histBtn.className = "py-2 text-xs font-bold uppercase tracking-widest text-slate-400 border-b-2 border-transparent";
        calCont.classList.remove('hidden');
        histCont.classList.add('hidden');
        setTimeout(() => {
            renderCalendar();
            updateCalendarAccountIndicator();
        }, 50);
    }
}

        function formatCompactNumber(number) {
            if (number === 0 || number === null || number === undefined) return "0";
            if (number >= 1000000) {
                return Math.floor(number / 1000000) + 'M';
            
            }
            if (number >= 1000) {
                return Math.floor(number / 1000) + 'k';
       
            }
            return number.toLocaleString('th-TH');
        }

    
function renderCalendar() {
    console.log("🔍 [CALENDAR] Starting render...");
    
    const grid = document.getElementById('calendarGrid');
    if (!grid) {
        console.error("Calendar grid not found");
        return;
    }
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const keyPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    
    let sourceTransactions = getCurrentTransactions();
    let monthTxs = sourceTransactions.filter(t => t.monthKey === keyPrefix);
    
    // ✅ แก้ไข: กรองตามบัญชี (ไม่แสดง transfer out ในบัญชีปลายทาง)
    if (accountFilterId !== 'all') {
        const filterAccountId = accountFilterId;
        
        monthTxs = monthTxs.filter(t => {
            // บัญชีต้นทาง: แสดงทุก transaction
            if (t.accountId === filterAccountId) {
                return true;
            }
            
            // บัญชีปลายทาง: แสดงเฉพาะ internal_receive (ฝั่งรับ) เท่านั้น
            // ไม่แสดง internal และ as_income (ฝั่งต้นทาง)
            if (t.type === 'transfer' && t.transferToAccountId === filterAccountId) {
                if (t.transferType === 'internal_receive') {
                    return true;
                }
                // ❌ ไม่แสดง internal, as_income (transfer out)
            }
            
            return false;
        });
    }
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    grid.innerHTML = '';
    
    for (let i = 0; i < firstDay; i++) {
        grid.innerHTML += `<div class="calendar-day not-current bg-slate-50/10 rounded-lg"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayTxs = monthTxs.filter(t => t.rawDate === dateStr);
        
        // คำนวณรายรับและรายจ่าย (สำหรับจุดสี)
        let incAmount = 0;
        let expAmount = 0;
        
        dayTxs.forEach(t => {
            if (t.type === 'income') {
                incAmount += t.amount;
            } else if (t.type === 'expense') {
                expAmount += t.amount;
            } else if (t.type === 'transfer') {
                // internal_receive: นับเป็นรายรับ
                if (t.transferType === 'internal_receive') {
                    incAmount += t.amount;
                }
                // internal, as_income (ฝั่งต้นทาง): นับเป็นรายจ่าย
                else if (t.transferType === 'internal' || t.transferType === 'as_income') {
                    expAmount += t.amount;
                }
            }
        });
        
        const numbers = `
            <div class="flex gap-1 mt-1">
                ${incAmount > 0 ? '<div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>' : ''}
                ${expAmount > 0 ? '<div class="w-1.5 h-1.5 rounded-full bg-rose-500"></div>' : ''}
            </div>
        `;

        grid.innerHTML += `
            <div onclick="openDayDetail('${dateStr}')" class="calendar-day bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-2 flex flex-col items-center justify-between hover:shadow-md transition-shadow">
                <span class="text-[12px] font-bold text-slate-400">${day}</span>
                ${numbers}
            </div>
        `;
    }
    
    console.log("✅ [CALENDAR] Render completed");
}


async function openDayDetail(dateStr) {
    console.log(`📅 Opening day detail for ${dateStr}`);
    
    try {
        let sourceTransactions = getCurrentTransactions();
        let dayTxs = sourceTransactions.filter(t => t.rawDate === dateStr);
        
        if (accountFilterId !== 'all') {
            const filterAccountId = accountFilterId;
            
            dayTxs = dayTxs.filter(t => {
                if (t.accountId === filterAccountId) {
                    return true;
                }
                
                if (t.type === 'transfer' && t.transferToAccountId === filterAccountId) {
                    if (t.transferType === 'internal_receive') {
                        return true;
                    }
                }
                
                return false;
            });
        }
        
        // คำนวณรายรับและรายจ่าย
        let inc = 0;
        let exp = 0;
        
        dayTxs.forEach(t => {
            if (t.type === 'income') {
                inc += t.amount;
            } else if (t.type === 'expense') {
                exp += t.amount;
            } else if (t.type === 'transfer') {
                if (t.transferType === 'internal_receive') {
                    inc += t.amount;
                } else if (t.transferType === 'internal' || t.transferType === 'as_income') {
                    exp += t.amount;
                }
            }
        });
        
        document.getElementById('detailDayInc').innerText = `฿${inc.toLocaleString()}`;
        document.getElementById('detailDayExp').innerText = `฿${exp.toLocaleString()}`;
        
        dayTxs.sort((a, b) => {
            const timeA = new Date(a.createdAt || a.updatedAt || a.date || 0).getTime();
            const timeB = new Date(b.createdAt || b.updatedAt || b.date || 0).getTime();
            return timeB - timeA;
        });
        
        const container = document.getElementById('dayDetailList');
        
        if (dayTxs.length === 0) {
            container.innerHTML = `<div class="p-8 text-center text-slate-400 italic text-xs">ไม่มีรายการสำหรับวันนี้</div>`;
        } else {
            container.innerHTML = dayTxs.map(t => {
                const tag = t.tag ? `<span class="text-[10px] font-bold text-indigo-400 uppercase">[${t.tag}]</span> ` : '';
                
                let sign = '';
                let amountClass = '';
                
                if (t.type === 'income') {
                    sign = '+';
                    amountClass = 'text-emerald-500';
                } else if (t.type === 'expense') {
                    sign = '-';
                    amountClass = 'text-rose-500';
                } else if (t.type === 'transfer') {
                    if (t.transferType === 'internal_receive') {
                        sign = '+';
                        amountClass = 'text-emerald-500';
                    } else {
                        sign = '-';
                        amountClass = 'text-rose-500';
                    }
                }
                
                // ✅ แก้ไข: ส่งแค่ transaction.id
                const onClickAction = isMobile() 
                    ? `onclick="showMobileActionModal('${t.id}')"`
                    : '';
                
                return `
                <div ${onClickAction}
                     class="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 group hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${isMobile() ? 'cursor-pointer' : ''}">
                    <div class="flex items-center gap-3">
                        <div class="text-lg">${t.icon}</div>
                        <div>
                            <p class="text-[14px] font-bold dark:text-white leading-tight">${tag}${t.desc}</p>
                            <p class="text-[12px] text-slate-400">${t.category}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <p class="font-bold text-[14px] ${amountClass}">
                            ${sign}฿${Math.abs(t.amount).toLocaleString()}
                        </p>
                        <div class="flex gap-1 ${isMobile() ? 'hidden' : 'opacity-0 group-hover:opacity-100 transition-opacity'}">
                            <button onclick="editDayTransaction('${t.id}', ${t.isDebtPayment ? 'true' : 'false'}, '${t.originalPaymentId || ''}')" 
                                    class="p-1 text-indigo-400 hover:bg-indigo-50 rounded" 
                                    title="แก้ไข">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button onclick="deleteDayTransaction('${t.id}', '${dateStr}')" 
                                    class="p-1 text-rose-400 hover:bg-rose-50 rounded" 
                                    title="ลบ">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>`;
            }).join('');
        }
        
        document.getElementById('dayDetailModal').classList.remove('hidden');
        
    } catch (error) {
        console.error('Error opening day detail:', error);
        showToast("❌ โหลดข้อมูลไม่สำเร็จ: " + error.message);
        
        const displayDate = new Date(dateStr).toLocaleDateString('th-TH', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
        document.getElementById('detailDateDisplay').innerText = displayDate;
        document.getElementById('detailDayInc').innerText = `฿0`;
        document.getElementById('detailDayExp').innerText = `฿0`;
        
        const container = document.getElementById('dayDetailList');
        container.innerHTML = `<div class="p-8 text-center text-slate-400 italic text-xs">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>`;
        
        document.getElementById('dayDetailModal').classList.remove('hidden');
    }
}

        function closeDayDetailModal() { 
            document.getElementById('dayDetailModal').classList.add('hidden'); 
        }

function editDayTransaction(id, isDebtPayment = false, originalPaymentId = '') {
    const t = transactions.find(tx => tx.id === id);
    if (!t) return;
    
    closeDayDetailModal();
    
    if (isMobile()) {
        openMobileForm(t);
    } else {
        editingTxId = id;
        document.getElementById('formTitle').innerText = "แก้ไข";
        document.getElementById('submitBtn').innerText = "อัปเดต";
        document.getElementById('cancelEditBtn').classList.remove('hidden');
        
        setType(t.type);
        document.getElementById('amount').value = t.amount;
        document.getElementById('desc').value = t.desc === t.category ? "" : t.desc;
        document.getElementById('tagInput').value = t.tag || "";
        document.getElementById('transDate').value = t.rawDate;
        document.getElementById('category').value = t.category;
        
        if (isDebtPayment && originalPaymentId) {
            console.log('📅 [Calendar] กำลังแก้ไขรายการผ่อนหนี้จากวันDetail, paymentId:', originalPaymentId);
            window.editingDebtPaymentId = originalPaymentId;
        } else {
            window.editingDebtPaymentId = null;
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        setTimeout(() => {
            document.getElementById('amount').focus();
        }, 300);
    }
}

async function deleteDayTransaction(id, dateStr) {
    if (isMobile()) {
        const transaction = transactions.find(t => t.id === id);
        if (transaction) {
            showMobileActionModal(transaction);
        }
        return;
    }
    
    showConfirm("ลบรายการ?", "ลบแล้วกู้คืนไม่ได้", async () => {
        try {
            const transactionToDelete = transactions.find(t => t.id === id);
            const isDebtPayment = transactionToDelete?.isDebtPayment;
            const originalPaymentId = transactionToDelete?.originalPaymentId;
            
            // ✅ 1. ลบจาก backend (MySQL) ถ้า login และออนไลน์
            if (isLoggedIn && navigator.onLine && !id.toString().startsWith('tx_')) {
                console.log('📡 Calling deleteTransactionFromBackend for id:', id);
                await deleteTransactionFromBackend(id);
            } else if (isLoggedIn && !navigator.onLine) {
                console.log('📱 Offline - adding to sync queue');
                addToSyncQueue({ id: id }, 'delete');
            }
            
            // ✅ 2. ลบจากเครื่อง
            const result = await financeDB.deleteTransaction(id);
            console.log('Delete result from financeDB:', result);
            
            if (result.success) {
                // ลบจาก arrays
                transactions = transactions.filter(t => t.id !== id);
                if (backendTransactions && backendTransactions.length > 0) {
                    backendTransactions = backendTransactions.filter(t => t.id !== id);
                }
                
                // ลบ payment record
                if (isDebtPayment && originalPaymentId) {
                    const paymentIndex = payments.findIndex(p => p.id === originalPaymentId);
                    if (paymentIndex !== -1) {
                        payments.splice(paymentIndex, 1);
                        savePaymentsToStorage();
                    }
                }
                
                updateUI();
                
                if (!document.getElementById('dayDetailModal').classList.contains('hidden')) {
                    openDayDetail(dateStr); 
                }
                
                renderCalendar();
                refreshAnalysisCharts();
                
                showToast("✅ ลบรายการสำเร็จ");
            } else {
                showToast("❌ ลบไม่สำเร็จ");
            }
            
            hideConfirm();
            
        } catch (error) {
            console.error('Error deleting day transaction:', error);
            hideConfirm();
            showToast("❌ ลบไม่สำเร็จ: " + error.message);
        }
    });
}



function updateUI() {
    const key = getMonthKey(); 

    let sourceTransactions = getCurrentTransactions();

    console.log(`🔄 updateUI() - เดือน: ${key}, isLoggedIn: ${isLoggedIn}`);
    console.log(`📊 ข้อมูลที่ใช้: ${sourceTransactions.length} รายการ`);
    
    let filtered = sourceTransactions.filter(t => t.monthKey === key);
    console.log(`📊 หลังจากกรองเดือน ${key}: ${filtered.length} รายการ`);
    
    // ✅ กรองตามบัญชี
    if (accountFilterId !== 'all') {
    const filterAccountId = accountFilterId;
    
    filtered = filtered.filter(t => {
        // บัญชีต้นทาง: แสดง transaction ที่ accountId ตรงกัน
        if (t.accountId === filterAccountId) {
            return true;
        }
        
        // บัญชีปลายทาง: แสดงเฉพาะ transfer ที่เป็นฝั่งรับ (internal_receive เท่านั้น)
        if (t.type === 'transfer' && t.transferToAccountId === filterAccountId) {
            // ✅ เฉพาะ internal_receive
            if (t.transferType === 'internal_receive') {
                return true;
            }
            // ❌ ไม่แสดง as_income (ฝั่งต้นทาง) ในบัญชีปลายทาง
        }
        
        return false;
    });
}
    
    filtered.sort((a, b) => {
        const dateA = new Date(a.rawDate || a.date || 0);
        const dateB = new Date(b.rawDate || b.date || 0);
        
        if (dateA.getTime() === dateB.getTime()) {
            const timeA = new Date(a.createdAt || a.updatedAt || 0).getTime();
            const timeB = new Date(b.createdAt || b.updatedAt || 0).getTime();
            return timeB - timeA;
        }
        
        return dateB - dateA;
    });

    // ✅ totalIncome: เฉพาะ income ปกติ + receive_income (as_income ฝั่งรับ)
    const inc = filtered.filter(t => 
        (t.type === 'income' && t.transferType !== 'internal_receive') ||
        (t.type === 'income' && t.transferType === 'receive_income')
    ).reduce((s, t) => s + t.amount, 0);
    
    // ✅ totalExpense: เฉพาะ expense
    const exp = filtered.filter(t => 
        t.type === 'expense'
    ).reduce((s, t) => s + t.amount, 0);
    
    document.getElementById('totalIncome').innerText = `฿${inc.toLocaleString()}`;
    document.getElementById('totalExpense').innerText = `฿${exp.toLocaleString()}`;
    
    // ✅ คำนวณยอดคงเหลือ (bal)
    let bal = 0;
    
    if (accountFilterId === 'all') {
        let totalIncome = 0;
        let totalExpense = 0;
        
        filtered.forEach(t => {
            if (t.type === 'income') {
                // ข้าม internal_receive เท่านั้น (as_income ฝั่งรับยังนับ)
                if (t.transferType !== 'internal_receive') {
                    totalIncome += t.amount;
                }
            } else if (t.type === 'expense') {
                totalExpense += t.amount;
            }
        });
        
        bal = totalIncome - totalExpense;
    } else {
        const filterAccountId = accountFilterId;
        
        // ✅ realIncome: income ปกติ + receive_income (as_income ฝั่งรับ)
        const realIncome = filtered.filter(t => 
            t.type === 'income' && 
            t.accountId === filterAccountId &&
            t.transferType !== 'internal_receive'
        ).reduce((s, t) => s + t.amount, 0);
        
        const expense = filtered.filter(t => 
            t.type === 'expense' && 
            t.accountId === filterAccountId
        ).reduce((s, t) => s + t.amount, 0);
        
        // ✅ transfersOut: เฉพาะฝั่งต้นทาง (internal, as_income)
        const transfersOut = filtered.filter(t => 
            t.type === 'transfer' && 
            t.accountId === filterAccountId &&
            (t.transferType === 'internal' || t.transferType === 'as_income')
        ).reduce((s, t) => s + t.amount, 0);
        
        // ✅ transfersIn: เฉพาะฝั่งรับ (internal_receive)
        const transfersIn = filtered.filter(t => 
            t.type === 'transfer' && 
            t.accountId === filterAccountId &&
            t.transferType === 'internal_receive'
        ).reduce((s, t) => s + t.amount, 0);
        
        bal = realIncome - expense - transfersOut + transfersIn;
    }
    
    const balEl = document.getElementById('totalBalance');
    balEl.innerText = `฿${Math.abs(bal).toLocaleString()}`; 
    balEl.style.color = bal < 0 ? '#FB7185' : '#34D399';
    
      const list = document.getElementById('historyList');
    
    if(filtered.length === 0) { 
        list.innerHTML = `<div class="p-8 text-center text-slate-300 text-xs italic">ไม่มีรายการ</div>`; 
    } else {
        let currentDate = null;
        let html = '';
        
        filtered.forEach(t => {
            const transactionDate = t.rawDate || t.date;
            
            if (transactionDate !== currentDate) {
                if (currentDate !== null) {
                    html += `<div class="border-t border-slate-100 dark:border-slate-700 my-2"></div>`;
                }
                
                const dateObj = new Date(transactionDate);
                const dayName = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'][dateObj.getDay()];
                const dayNumber = dateObj.getDate();
                const monthName = dateObj.toLocaleDateString('th-TH', { month: 'short' });
                
                const dailyTransactions = filtered.filter(item => (item.rawDate || item.date) === transactionDate);

                let dailyIncome = 0;
                let dailyExpense = 0;

                dailyTransactions.forEach(item => {
                    if (item.type === 'income') {
                        // income ปกติ และ receive_income (as_income ฝั่งรับ)
                        dailyIncome += item.amount;
                    } else if (item.type === 'expense') {
                        dailyExpense += item.amount;
                    } else if (item.type === 'transfer') {
                        // internal_receive: นับเป็นรายรับ (สำหรับ daily summary)
                        if (item.transferType === 'internal_receive') {
                            dailyIncome += item.amount;
                        }
                        // as_income (ฝั่งต้นทาง): นับเป็นรายจ่าย
                        else if (item.transferType === 'as_income') {
                            dailyExpense += item.amount;
                        }
                        // internal (ฝั่งต้นทาง): นับเป็นรายจ่าย
                        else if (item.transferType === 'internal') {
                            dailyExpense += item.amount;
                        }
                    }
                });
                
                html += `
                <div class="sticky top-0 z-10 bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-sm px-4 py-3 border-b border-slate-800 dark:border-slate-800">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-bold text-slate-700 dark:text-slate-300">วัน${dayName} ที่ ${dayNumber} ${monthName}</span>
                        </div>
                        <div class="flex gap-3">
                            <span class="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded-full font-bold">
                                +฿${dailyIncome.toLocaleString()}
                            </span>
                            <span class="text-[10px] bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 px-2 py-1 rounded-full font-bold">
                                -฿${dailyExpense.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>`;
                
                currentDate = transactionDate;
            }
            
            const tag = t.tag ? `<span class="inline-block px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-500 text-[10px] font-bold dark:bg-indigo-900/30 dark:text-indigo-400 mr-1.5 uppercase">[${t.tag}]</span>` : '';
            
            const onClickAction = isMobile() 
                ? `onclick="showMobileActionModal(${JSON.stringify(t).replace(/"/g, '&quot;')})"`
                : '';
            
            let sign = '';
            let amountClass = '';
            
            if (t.type === 'income') {
                sign = '+';
                amountClass = 'text-emerald-400';
            } else if (t.type === 'expense') {
                sign = '-';
                amountClass = 'text-rose-400';
            } else if (t.type === 'transfer') {
                if (t.transferType === 'internal_receive') {
                    sign = '+';
                    amountClass = 'text-emerald-400';
                } else {
                    sign = '-';
                    amountClass = 'text-rose-400';
                }
            }
            
            html += `
            <div class="px-4 py-3 flex justify-between items-center group hover:bg-slate-50 transition-colors dark:hover:bg-slate-800/50 history-item" 
                 data-transaction-id="${t.id}" 
                 ${isMobile() ? 'style="cursor: pointer;"' : ''}>
                <div class="flex items-center gap-3">
                    <div class="text-xl">${t.icon}</div>
                    <div>
                        <p class="font-bold text-[14px] text-slate-700 leading-tight dark:text-white">${tag}${t.desc}</p>
                        <p class="text-[12px] text-slate-400 font-medium">${t.category}</p>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <p class="font-bold text-[14px] ${amountClass}">
                        ${sign}฿${Math.abs(t.amount).toLocaleString()}
                    </p>
                    <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex">
                        <button onclick="editTransaction('${t.id}')" class="p-1 text-indigo-400 hover:text-indigo-600" title="แก้ไข">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button onclick="deleteTransaction('${t.id}')" class="p-1 text-rose-400 hover:text-rose-600" title="ลบ">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>`;
        });
        
        list.innerHTML = html;
    }
    
    const isCalendarTabActive = !document.getElementById('overview-calendar-content').classList.contains('hidden');
    const isOverviewPage = !document.getElementById('page-overview').classList.contains('hidden');
    
    if (isOverviewPage && isCalendarTabActive) {
        renderCalendar();
    }
    setTimeout(() => {
        bindHistoryItemEvents();
    }, 100);
}

    // ✅ ฟังก์ชัน refreshDataAfterSave (ย้ายไปอยู่นอกการคำนวณ bal)
    async function refreshDataAfterSave() {
        if (isLoggedIn && navigator.onLine) {
            await loadTransactionsFromBackend();
            isShowingBackendData = true;
            updateUI();
        }
    }

function calculateTotalBudget(targets, income, mode) {
    let totalSpending = 0;
    let totalInvestment = 0;
    
    if (mode === 'percentage') {
        let spendPct = 0;
        let investPct = 0;
        
        Object.entries(targets).forEach(([catId, target]) => {
            const cat = [...customCategories.spending, ...customCategories.investment]
                .find(c => c.id === catId);
            if (!cat) return;
            
            const value = target.value || 0;
            const isInvestment = customCategories.investment.some(c => c.id === catId);
            
            if (isInvestment) {
                investPct += value;
            } else {
                spendPct += value;
            }
        });
        
        const adjustedIncome = Math.max(0, realIncome - transferOut);
totalSpending = adjustedIncome * (spendPct / 100);
totalInvestment = adjustedIncome * (investPct / 100);
    } else {
        Object.entries(targets).forEach(([catId, target]) => {
            const cat = [...customCategories.spending, ...customCategories.investment]
                .find(c => c.id === catId);
            if (!cat) return;
            
            const isInvestment = customCategories.investment.some(c => c.id === catId);
            const value = target.value || 0;
            
            if (target.mode === 'fixed') {
                if (isInvestment) {
                    totalInvestment += value;
                } else {
                    totalSpending += value;
                }
            } else if (target.mode === 'percentage') {
                if (isInvestment) {
                    totalInvestment += income * (value / 100);
                } else {
                    totalSpending += income * (value / 100);
                }
            }
        });
    }
    
    return { totalSpending, totalInvestment };
}



function updateBudgetUI() {
    const key = getMonthKey(); 
    
    let sourceTransactions = getCurrentTransactions();
    let filtered = sourceTransactions.filter(t => t.monthKey === key);
    
    if (accountFilterId !== 'all') {
        filtered = filtered.filter(t => {
            // ✅ แปลงให้เป็น string ก่อนเปรียบเทียบ
            const txAccountId = t.accountId ? t.accountId.toString() : null;
            const filterAccountId = accountFilterId.toString();
            
            return txAccountId === filterAccountId || 
                   (t.type === 'transfer' && t.transferToAccountId?.toString() === filterAccountId);
        });
    }
    let income = 0;
    
    if (accountFilterId === 'all') {
        income = filtered.filter(t => 
            t.type === 'income' && !t.isTransferIncome
        ).reduce((s, t) => s + t.amount, 0);
        
    } else {
  
        const realIncome = filtered.filter(t => 
            t.type === 'income' && 
            t.accountId === accountFilterId &&
            !t.isTransferIncome
        ).reduce((s, t) => s + t.amount, 0);
        
    
        const transferIncome = filtered.filter(t => 
            t.type === 'income' && 
            t.accountId === accountFilterId &&
            t.isTransferIncome === true  
        ).reduce((s, t) => s + t.amount, 0);
        
        const transferOut = filtered.filter(t => 
            t.type === 'transfer' && 
            t.accountId === accountFilterId
        ).reduce((s, t) => s + t.amount, 0);
        
        income = Math.max(0, realIncome + transferIncome - transferOut);
    }

            const targets = categoryTargets[key] || {};

    let tSpend = 0; 
    let tInvest = 0; 
    
    if (budgetMode === 'percentage') {
        let spendPct = 0;
        customCategories.spending.forEach(c => {
            const targetValue = targets[c.id]?.value ?? c.default;
            if (targetValue !== null && targetValue !== undefined) {
                spendPct += targetValue;
            }
        });
        tSpend = income * (spendPct / 100);
        tInvest = Math.max(0, income - tSpend);
    } else {
        customCategories.spending.forEach(c => {
            const target = targets[c.id];
            if (target && target.mode === 'fixed') {
                tSpend += target.value || 0;
            } else if (target && target.mode === 'percentage') {
                tSpend += income * (target.value / 100);
            }
        });
        
        customCategories.investment.forEach(c => {
            const target = targets[c.id];
            if (target && target.mode === 'fixed') {
                tInvest += target.value || 0;
            } else if (target && target.mode === 'percentage') {
                tInvest += income * (target.value / 100);
            }
        });
    }
    
    const aSpend = filtered.filter(t => t.type === 'expense' && customCategories.spending.some(c => c.label === t.category)).reduce((s, t) => s + t.amount, 0);
    const aInvest = filtered.filter(t => t.type === 'expense' && customCategories.investment.some(c => c.label === t.category)).reduce((s, t) => s + t.amount, 0);

    
    
    document.getElementById('summary-spending-amount').innerText = `฿${tSpend.toLocaleString()}`;
    document.getElementById('summary-spending-percent-badge').innerText = 
        budgetMode === 'percentage' ? `${Math.round((tSpend / income) * 100)}%` : 'คงที่';
    
    document.getElementById('pool-spending-actual').innerText = `฿${aSpend.toLocaleString()}`;
    const sRem = tSpend - aSpend; 
    document.getElementById('pool-spending-remain').innerText = `฿${sRem.toLocaleString()}`;
    document.getElementById('pool-spending-remain').className = sRem < 0 ? 'text-[14px] font-bold text-rose-500' : 'text-[14px] font-bold text-emerald-500';
    
    document.getElementById('summary-investment-amount').innerText = `฿${tInvest.toLocaleString()}`;
    document.getElementById('summary-investment-percent-badge').innerText = 
        budgetMode === 'percentage' ? `${Math.round((tInvest / income) * 100)}%` : 'คงที่';
    
    document.getElementById('pool-investment-actual').innerText = `฿${aInvest.toLocaleString()}`;
    const iRem = tInvest - aInvest; 
    document.getElementById('pool-investment-remain').innerText = `฿${iRem.toLocaleString()}`;
    document.getElementById('pool-investment-remain').className = iRem < 0 ? 'text-[14px] font-bold text-rose-500' : 'text-[14px] font-bold text-emerald-500';
            
 const render = (cats, el, isInv) => {
    el.innerHTML = cats.map(c => {
        const target = targets[c.id];
        const targetValue = target?.value ?? c.default; 
        const targetMode = target?.mode || 'percentage';

        const hasValue = targetValue !== null && targetValue !== undefined;
        
        let budgetAmount;
        if (targetMode === 'percentage') {
            budgetAmount = isInv ? (tInvest * (targetValue / 100)) : (income * (targetValue / 100));
        } else {
            budgetAmount = targetValue || 0; 
        }
        
        const a = filtered.filter(tr => tr.category === c.label).reduce((s, tr) => s + tr.amount, 0);
        const r = budgetAmount - a; 
        const prog = budgetAmount > 0 ? Math.min((a / budgetAmount) * 100, 100) : 0;
        
        let statusHtml = isInv ? 
            (r <= 0 ? 'ครบแล้ว' : 'ขาด ฿' + Math.abs(r).toLocaleString()) : 
            (r < 0 ? 'เกิน ฿' + Math.abs(r).toLocaleString() : 'เหลือ ฿' + Math.abs(r).toLocaleString());
        
        let targetDisplay = '';
        if (targetMode === 'percentage') {
            argetDisplay = hasValue ? `${targetValue}%` : '-- %';
        } else {
            targetDisplay = hasValue ? `฿${targetValue.toLocaleString()}` : '-- ฿';
        }
        
return `<div onclick="openPortionModal('${c.id}', ${isInv})" class="bg-white p-4 rounded-2xl border 
        border-slate-100 dark:bg-slate-800 dark:border-slate-700 cursor-pointer">
            <div class="flex justify-between items-start">
                <div class="flex items-center gap-2">
                    <span>${c.icon}</span>
                    <div>
                        <!-- ⭐⭐ แก้ไขบรรทัดนี้ ⭐⭐ -->
                        <p class="text-[12px] font-bold dark:text-white">
                            ${c.label} 
                            ${budgetMode === 'percentage' && targetValue !== null && targetValue !== undefined ? 
                                `<span class="text-[12px] text-indigo-500 dark:text-indigo-400 ml-1">${targetValue}%</span>` : 
                                ''
                            }
                        </p>
                        <p class="text-[9px] text-slate-400 font-bold">
                            ${targetDisplay}
                        </p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-[10px] font-bold text-slate-400">ใช้จริง ฿${a.toLocaleString()}</p>
                    <p class="text-[10px] font-bold ${isInv ? (r <= 0 ? 'text-emerald-500' : 'text-indigo-400') : (r < 0 ? 'text-rose-500' : 'text-emerald-500')}">${statusHtml}</p>
                </div>
            </div>
            <div class="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden dark:bg-slate-700">
                <div class="h-full ${!isInv && a > budgetAmount ? 'bg-rose-500' : 'bg-emerald-500'}" style="width: ${prog}%"></div>
            </div>
        </div>`;
    }).join('');
};
            render(customCategories.spending, document.getElementById('grid-spending'), false);
            render(customCategories.investment, document.getElementById('grid-investment'), true);
        }
checkBudgetAlerts();
function checkBudgetAlerts() {
    const key = getMonthKey();
    
    let filtered = transactions.filter(t => 
        t.monthKey === key && 
        t.type !== 'transfer'
    );
    
    if (accountFilterId !== 'all') {
        filtered = filtered.filter(t => t.accountId === accountFilterId);
    }
    const income = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const targets = categoryTargets[key] || {};
    
    let alertMessages = [];
    
    customCategories.spending.forEach(c => {
        const ratio = targets[c.id]?.value ?? (c.default || 0);
        const budget = income * (ratio / 100);
        const actual = filtered.filter(tr => tr.category === c.label).reduce((s, tr) => s + tr.amount, 0);
        
        if (actual > budget && actual > 0 && budget > 0) {
            const overAmount = actual - budget;
            const overPercentage = Math.round((overAmount / budget) * 100);
            
            if (overPercentage >= 10) { 
                alertMessages.push(`⚠️ งบประมาณ <b>${c.label}</b> เกิน <b>${overPercentage}%</b> (เกิน ฿${overAmount.toLocaleString()})`);
            }
        }
    });
    
    const totalSpending = filtered.filter(t => t.type === 'expense' && 
        customCategories.spending.some(c => c.label === t.category)).reduce((s, t) => s + t.amount, 0);
    const totalInvestment = filtered.filter(t => t.type === 'expense' && 
        customCategories.investment.some(c => c.label === t.category)).reduce((s, t) => s + t.amount, 0);
    const totalExpense = totalSpending + totalInvestment;
    
    if (income > 0) {
        const expensePercentage = Math.round((totalExpense / income) * 100);
        
        if (expensePercentage > 90) {
            alertMessages.push(`🚨 <b>รายจ่ายรวม ${expensePercentage}%</b> ของรายได้ ใกล้เต็มงบประมาณแล้ว!`);
        } else if (expensePercentage > 100) {
            alertMessages.push(`🚨 <b>รายจ่ายรวมเกินรายได้ ${expensePercentage - 100}%</b> ใช้งบประมาณเกินแล้ว!`);
        }
    }
    
    if (alertMessages.length > 0) {
        showToast(alertMessages[0].replace(/<[^>]*>/g, ''));
        
        console.log("Budget Alerts:", alertMessages);
    }
}




function copyBudgetFromPreviousMonth() {
    const currentMonth = getMonthKey(); 
    const [currentYear, currentMonthNum] = currentMonth.split('-').map(Number);
    
    let prevYear = currentYear;
    let prevMonthNum = currentMonthNum - 1;
    
    if (prevMonthNum === 0) {
        prevMonthNum = 12;
        prevYear -= 1;
    }
    
    const prevMonthKey = `${prevYear}-${String(prevMonthNum).padStart(2, '0')}`;
    
    const previousBudget = categoryTargets[prevMonthKey];
    
    if (!previousBudget || Object.keys(previousBudget).length === 0) {
        showConfirm(
            "ไม่พบข้อมูลงบประมาณ",
            `ไม่พบข้อมูลงบประมาณสำหรับเดือน ${prevMonthKey}`,
            () => hideConfirm()
        );
        return;
    }
    
    const currentMonthName = monthFullNames[currentMonthNum - 1];
    const prevMonthName = monthFullNames[prevMonthNum - 1];
    
    showConfirm(
        `คัดลอกงบประมาณจาก ${prevMonthName} มา ${currentMonthName}?`,
        "ค่าทั้งหมดจะถูกคัดลอกและเขียนทับค่าเดิมในเดือนนี้ (ถ้ามี)",
        () => {
            categoryTargets[currentMonth] = JSON.parse(JSON.stringify(previousBudget));
            
            localStorage.setItem('fin_targets_v5', JSON.stringify(categoryTargets));
            
            updateBudgetUI();
            
            showToast(`✅ คัดลอกงบประมาณจาก ${prevMonthName} สำเร็จ`);
            
            hideConfirm();
        }
    );
}



function getAnalysisData() {
    console.log("🔍 getAnalysisData() called");
    
    const now = new Date();
    let startDate, endDate;
    const year = analysisDate.getFullYear();
    const month = analysisDate.getMonth();
    
    switch(analysisPeriod) {
        case 'month':
            startDate = new Date(year, month, 1);
            endDate = new Date(year, month + 1, 0);
            break;
        case 'quarter':
            const quarter = Math.floor(month / 3);
            startDate = new Date(year, quarter * 3, 1);
            endDate = new Date(year, (quarter * 3) + 3, 0);
            break;
        case 'year':
            startDate = new Date(year, 0, 1);
            endDate = new Date(year, 11, 31);
            break;
    }

    const targetMonthKey = `${year}-${String(month + 1).padStart(2, '0')}`;

    let sourceTransactions = getCurrentTransactions();
    
    console.log("📅 Date Range:", {
        targetMonthKey,
        startDate: startDate.toLocaleDateString(),
        endDate: endDate.toLocaleDateString(),
        analysisPeriod
    });
    
  let filtered = sourceTransactions.filter(t => 
        t.monthKey === targetMonthKey && 
        (t.type === 'income' || t.type === 'expense')
    );
    
     if (accountFilterId !== 'all') {
        filtered = filtered.filter(t => {
            // ✅ แปลงให้เป็น string ก่อนเปรียบเทียบ
            const txAccountId = t.accountId ? t.accountId.toString() : null;
            const filterAccountId = accountFilterId.toString();
            return txAccountId === filterAccountId;
        });
    }
    
    console.log("📝 Filtered Transactions:", filtered.length);
    
    const income = filtered.filter(t => 
    t.type === 'income' || 
    (t.type === 'transfer' && t.transferType === 'as_income')
);
    const expense = filtered.filter(t => t.type === 'expense');
    
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = expense.reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;
    const totalInvestmentActual = expense.filter(t => 
    customCategories.investment.some(c => c.label === t.category)
).reduce((sum, t) => sum + t.amount, 0);

const savingRate = totalIncome > 0 ? (totalInvestmentActual / totalIncome) * 100 : 0;
    
    console.log("💰 Financial Summary:", {
        totalIncome,
        totalExpense,
        balance,
        savingRate
    });
    
    const spendingByCategory = {};
    expense.forEach(t => {
        if (!spendingByCategory[t.category]) {
            spendingByCategory[t.category] = { amount: 0, count: 0, icon: t.icon };
        }
        spendingByCategory[t.category].amount += t.amount;
        spendingByCategory[t.category].count++;
    });
    
    console.log("🏷️ Categories:", Object.keys(spendingByCategory).length);
    
    const spendingByTag = {};
    const tagFrequency = {};
    expense.forEach(t => {
        if (t.tag && t.tag.trim() !== '') {
            const tag = t.tag.trim();
            
            if (!spendingByTag[tag]) {
                spendingByTag[tag] = { amount: 0, count: 0, categories: new Set() };
            }
            if (!tagFrequency[tag]) {
                tagFrequency[tag] = 0;
            }
            
            spendingByTag[tag].amount += t.amount;
            spendingByTag[tag].count++;
            spendingByTag[tag].categories.add(t.category);
            tagFrequency[tag]++;
        }
    });

    Object.keys(spendingByTag).forEach(tag => {
        spendingByTag[tag].categories = Array.from(spendingByTag[tag].categories);
        spendingByTag[tag].avgAmount = spendingByTag[tag].amount / spendingByTag[tag].count;
    });
    
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const avgIncomePerDay = totalIncome / daysDiff;
    const avgExpensePerDay = totalExpense / daysDiff;
    const transactionsPerDay = filtered.length / daysDiff;
    
    const topCategories = Object.entries(spendingByCategory)
        .map(([category, data]) => ({ category, ...data }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);
        
    const topTags = Object.entries(spendingByTag)
        .map(([tag, data]) => ({ tag, ...data }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);
        
    const monthlyTrends = getMonthlyTrends(12, analysisDate);
    const spendingByDayOfWeek = getSpendingByDayOfWeek(filtered);
    const expenseWithoutInvestment = totalExpense - totalInvestmentActual;
const expenseRatio = totalIncome > 0 ? (expenseWithoutInvestment / totalIncome) * 100 : 0;
    
    return {
        filtered,
        income,
        expense,
        totalIncome,
        totalExpense,
        balance,
        savingRate,
        expenseRatio,
        spendingByCategory,
        spendingByTag,
        tagFrequency,
        avgIncomePerDay,
        avgExpensePerDay,
        transactionsPerDay,
        topCategories,
        topTags,
        monthlyTrends,
        spendingByDayOfWeek,
        daysDiff,
        startDate,
        endDate
    };
}

function generateTagColors(count) {
    const tagColors = [
        '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
        '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'
    ];
    
    const result = [];
    for (let i = 0; i < count; i++) {
        result.push(tagColors[i % tagColors.length]);
    }
    
    return result;
}


function getTagAnalysisData() {
    const data = getAnalysisData();
    
    const tagStats = {};
    let totalTagExpense = 0;
    
    data.expense.forEach(expense => {
        if (expense.tag && expense.tag.trim() !== '') {
            const tag = expense.tag.trim();
            if (!tagStats[tag]) {
                tagStats[tag] = {
                    amount: 0,
                    count: 0,
                    categories: new Set(),
                    avgAmount: 0
                };
            }
            
            tagStats[tag].amount += expense.amount;
            tagStats[tag].count++;
            tagStats[tag].categories.add(expense.category);
            
            totalTagExpense += expense.amount;
        }
    });
    
    Object.keys(tagStats).forEach(tag => {
        tagStats[tag].avgAmount = tagStats[tag].amount / tagStats[tag].count;
        tagStats[tag].categoryCount = tagStats[tag].categories.size;
        tagStats[tag].categories = Array.from(tagStats[tag].categories);
    });
    
    const sortedTags = Object.keys(tagStats)
        .map(tag => ({
            tag,
            ...tagStats[tag]
        }))
        .sort((a, b) => b.amount - a.amount);
    
    const topTags = sortedTags.slice(0, 5);
    
    const mostFrequentTag = sortedTags.sort((a, b) => b.count - a.count)[0];
    
    return {
        tagStats,
        totalTagExpense,
        sortedTags,
        topTags,
        mostFrequentTag,
        totalTags: Object.keys(tagStats).length,
        hasTagData: Object.keys(tagStats).length > 0
    };
}

function updateTagAnalysisUI() {
    console.log("🔄 updateTagAnalysisUI START");
    
    try {
        const tagData = getTagAnalysisData();
        
        updateTopTagsList(tagData);
        
        updateTagComparisonChart(tagData);
        
        updateTagStats(tagData);
        
        console.log("✅ updateTagAnalysisUI END - แสดงข้อมูล TAG สำหรับเดือน:", 
                   `${analysisDate.getFullYear()}-${analysisDate.getMonth() + 1}`);
    } catch (error) {
        console.error('❌ Error in updateTagAnalysisUI:', error);
    }
}

function updateTopTagsList(tagData) {
    const container = document.getElementById('topTagsList');
    
    if (!tagData.hasTagData) {
        container.innerHTML = `
            <div class="p-8 text-center text-slate-400 italic text-sm">
                <div class="text-3xl mb-2">🏷️</div>
                <p>ยังไม่มีข้อมูล TAG</p>
                <p class="text-xs mt-1">เพิ่ม TAG ในรายการบันทึกรายจ่ายเพื่อวิเคราะห์</p>
            </div>
        `;
        return;
    }
    
    const totalExpense = tagData.totalTagExpense;
    
    container.innerHTML = tagData.topTags.map((tag, index) => {
        const percentage = totalExpense > 0 ? (tag.amount / totalExpense) * 100 : 0;
        const width = Math.min(percentage * 2, 100);
        
        const rankColors = [
            'bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-orange-500'
        ];
        const rankColor = rankColors[index] || 'bg-slate-500';
        
        const rankIcons = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
        const rankIcon = rankIcons[index] || '🏷️';
        
        return `
        <div class="space-y-2">
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <span class="text-lg">${rankIcon}</span>
                    <div>
                        <span class="font-bold text-sm dark:text-white">#${tag.tag}</span>
                        <div class="flex gap-2">
                            <span class="text-[10px] px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full dark:bg-indigo-900/30 dark:text-indigo-400">
                                ${tag.count} รายการ
                            </span>
                            <span class="text-[10px] px-2 py-0.5 bg-rose-100 text-rose-600 rounded-full dark:bg-rose-900/30 dark:text-rose-400">
                                ${tag.categoryCount} หมวดหมู่
                            </span>
                        </div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-bold text-sm">฿${tag.amount.toLocaleString()}</div>
                    <div class="text-[10px] text-slate-400">${percentage.toFixed(1)}%</div>
                </div>
            </div>
            <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-700">
                <div class="h-full ${rankColor} rounded-full" style="width: ${width}%"></div>
            </div>
            <div class="text-[10px] text-slate-400">
                💰 เฉลี่ย: ฿${Math.round(tag.avgAmount).toLocaleString()}/รายการ •
                📁 หมวดหมู่: ${tag.categories.slice(0, 3).join(', ')}${tag.categories.length > 3 ? '...' : ''}
            </div>
        </div>`;
    }).join('');
}

function updateTagComparisonChart(tagData) {
    const canvas = document.getElementById('tagComparisonChart');
    const container = canvas?.parentElement;
    
    if (!container) return;
    
    if (!tagData.hasTagData) {
        canvas.style.display = 'none';
        
        const existingMessage = container.querySelector('.no-data-message-tag');
        if (existingMessage) return;
        
        const message = document.createElement('div');
        message.className = 'no-data-message-tag h-64 flex items-center justify-center text-slate-400 text-sm italic';
        message.textContent = 'ไม่มีข้อมูล TAG สำหรับแสดงกราฟ';
        container.appendChild(message);
        return;
    }
    
    canvas.style.display = 'block';
    
    const noDataMsg = container.querySelector('.no-data-message-tag');
    if (noDataMsg) noDataMsg.remove();
    
    const top8Tags = tagData.sortedTags.slice(0, 8);
    const labels = top8Tags.map(t => `#${t.tag}`);
    const amounts = top8Tags.map(t => t.amount);
    const colors = generateColors(top8Tags.length);
    
    const ctx = canvas.getContext('2d');
    
    if (analysisCharts.tagComparison) {
        analysisCharts.tagComparison.data.labels = labels;
        analysisCharts.tagComparison.data.datasets[0].data = amounts;
        analysisCharts.tagComparison.data.datasets[0].backgroundColor = colors;
        analysisCharts.tagComparison.update();
    } else {
        analysisCharts.tagComparison = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'จำนวนเงิน (บาท)',
                    data: amounts,
                    backgroundColor: colors,
                    borderWidth: 1,
                    borderColor: '#1e293b',
                    borderRadius: 6,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const tag = tagData.sortedTags[context.dataIndex];
                                const avg = Math.round(tag.avgAmount);
                                return [
                                    `ยอดรวม: ฿${context.raw.toLocaleString()}`,
                                    `จำนวนรายการ: ${tag.count}`,
                                    `ค่าเฉลี่ย/รายการ: ฿${avg.toLocaleString()}`
                                ];
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#ffffff',
                            callback: function(value) {
                                if (value >= 1000000) {
                                    return '฿' + (value / 1000000).toFixed(1) + 'M';
                                }
                                if (value >= 1000) {
                                    return '฿' + (value / 1000).toFixed(0) + 'k';
                                }
                                return '฿' + value;
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            color: '#ffffff',
                            maxRotation: 45
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }
}

function updateTagStats(tagData) {
    const totalTagsEl = document.getElementById('totalTagsCount');
    if (totalTagsEl) {
        totalTagsEl.textContent = tagData.totalTags;
        
        if (tagData.totalTags >= 10) {
            totalTagsEl.style.color = '#8b5cf6';
        } else if (tagData.totalTags >= 5) {
            totalTagsEl.style.color = '#3b82f6';
        } else {
            totalTagsEl.style.color = '#f7f7f7';
        }
    }
    
    const mostUsedTagEl = document.getElementById('mostUsedTag');
    if (mostUsedTagEl && tagData.mostFrequentTag) {
        const tag = tagData.mostFrequentTag;
        mostUsedTagEl.innerHTML = `
            <span class="text-sm">#${tag.tag}</span>
            <span class="text-[10px] text-slate-400 block">${tag.count} รายการ</span>
        `;
    }
}

function updateTagInsights(data) {
    const tagData = getTagAnalysisData();
    
    if (!tagData.hasTagData) {
        return [];
    }
    
    const insights = [];
    const topTag = tagData.topTags[0];
    
    if (topTag) {
        const totalExpense = data.totalExpense;
        const tagPercentage = (topTag.amount / totalExpense) * 100;
        
        insights.push({
            icon: '🏷️',
            title: 'TAG ที่ใช้งามากที่สุด',
            content: `#${topTag.tag} ใช้งบประมาณ ${tagPercentage.toFixed(1)}% ของรายจ่ายทั้งหมด (฿${topTag.amount.toLocaleString()})`,
            type: tagPercentage > 30 ? 'warning' : 'info'
        });
    }
    
    if (tagData.totalTags > 0) {
        const avgPerTag = data.totalExpense / tagData.totalTags;
        
        if (tagData.totalTags >= 10) {
            insights.push({
                icon: '🎯',
                title: 'การใช้ TAG หลากหลาย',
                content: `ใช้ ${tagData.totalTags} TAG เฉลี่ย ฿${Math.round(avgPerTag).toLocaleString()}/TAG`,
                type: 'success'
            });
        } else if (tagData.totalTags < 3) {
            insights.push({
                icon: '📝',
                title: 'ควรเพิ่ม TAG ให้หลากหลาย',
                content: `ใช้เพียง ${tagData.totalTags} TAG เพิ่ม TAG เพื่อการวิเคราะห์ที่ดีขึ้น`,
                type: 'info'
            });
        }
    }
    
    return insights;
}




function getTransferDisplayInfo(transaction) {
    if (transaction.type === 'transfer') {
        const fromAccount = getAccountById(transaction.accountId);
        const toAccount = getAccountById(transaction.transferToAccountId);
        
        if (transaction.transferType === 'as_income') {
            return {
                icon: '💰',
                text: `รับโอนจาก ${fromAccount?.name || 'บัญชีอื่น'}`,
                category: transaction.category,
                isIncome: true
            };
        } else {
            return {
                icon: '🔄',
                text: `โอนไป ${toAccount?.name || 'บัญชีอื่น'}`,
                category: 'โอนเงิน',
                isIncome: false
            };
        }
    }
    
    return null;
}

function getMonthlyTrends(monthsCount, analysisDate) {
    const trends = [];
    const baseDate = analysisDate || new Date();
    const baseYear = baseDate.getFullYear();
    const baseMonth = baseDate.getMonth();
    
    for (let i = monthsCount - 1; i >= 0; i--) {
        const date = new Date(baseYear, baseMonth - i, 1);
        const year = date.getFullYear();
        const month = date.getMonth();
        const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
        
        let monthTransactions = transactions.filter(t => 
            t.monthKey === monthKey && 
            t.type !== 'transfer'
        );
        
        if (accountFilterId !== 'all') {
            monthTransactions = monthTransactions.filter(t => t.accountId === accountFilterId);  
        }
        
        const monthIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const monthExpense = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        
        trends.push({
            month: monthNames[month],
            monthFull: monthFullNames[month],
            year,
            income: monthIncome,
            expense: monthExpense,
            balance: monthIncome - monthExpense,
            filtered: accountFilterId !== 'all' ? `(filtered: ${accountFilterId})` : '',
            transactionCount: monthTransactions.length
        });
    }
    
    console.log(`📈 Monthly trends generated (${trends.length} months, filter: ${accountFilterId})`);
    return trends;
}




function debugAnalysisPage() {
    console.clear();
    console.log("🔍 ===== ANALYSIS PAGE DEBUG ===== 🔍");
    console.log("Timestamp:", new Date().toLocaleString());
    
    console.log("\n📊 1. ข้อมูลพื้นฐาน");
    console.log("- Current Page:", getCurrentPage());
    console.log("- Analysis Period:", analysisPeriod);
    console.log("- Analysis Date:", analysisDate.toLocaleDateString('th-TH'));
    console.log("- Current Month:", getMonthKey());
    
    console.log("\n📝 2. ข้อมูล Transaction");
    const currentMonthKey = getMonthKey();
    const monthTransactions = transactions.filter(t => t.monthKey === currentMonthKey);
    console.log("- รายการทั้งหมด:", monthTransactions.length, "รายการ");
    console.log("- รายการรายรับ:", monthTransactions.filter(t => t.type === 'income').length);
    console.log("- รายการรายจ่าย:", monthTransactions.filter(t => t.type === 'expense').length);
    console.log("- รายการโอนเงิน:", monthTransactions.filter(t => t.type === 'transfer').length);
    
    console.log("\n📈 3. ข้อมูล Analysis");
    const analysisData = getAnalysisData();
    
    console.log("- รายรับรวม:", analysisData.totalIncome.toLocaleString());
    console.log("- รายจ่ายรวม:", analysisData.totalExpense.toLocaleString());
    console.log("- ยอดคงเหลือ:", analysisData.balance.toLocaleString());
    console.log("- อัตราการออม:", analysisData.savingRate.toFixed(1) + "%");
    
    console.log("\n🏷️ 4. หมวดหมู่รายจ่าย");
    const categories = Object.entries(analysisData.spendingByCategory);
    if (categories.length > 0) {
        categories.forEach(([cat, data]) => {
            console.log(`  - ${cat}: ฿${data.amount.toLocaleString()} (${data.count} รายการ)`);
        });
    } else {
        console.log("  - ไม่มีข้อมูลรายจ่าย");
    }
    
    console.log("\n📊 5. สถานะกราฟ");
    console.log("- spendingPieChart:", analysisCharts.spendingPie ? "✅ พร้อมใช้งาน" : "❌ ไม่พร้อม");
    console.log("- incomeExpenseChart:", analysisCharts.incomeExpense ? "✅ พร้อมใช้งาน" : "❌ ไม่พร้อม");
    console.log("- categoryComparisonChart:", analysisCharts.categoryComparison ? "✅ พร้อมใช้งาน" : "❌ ไม่พร้อม");
    console.log("- incomeTrendChart:", analysisCharts.incomeTrend ? "✅ พร้อมใช้งาน" : "❌ ไม่พร้อม");
    console.log("- expenseTrendChart:", analysisCharts.expenseTrend ? "✅ พร้อมใช้งาน" : "❌ ไม่พร้อม");
    
    console.log("\n🎯 6. การตั้งค่า UI");
    const activeTab = document.querySelector('.analysis-tab-btn.active');
    console.log("- แท็บที่เลือก:", activeTab ? activeTab.id.replace('a-tab-', '') : "ไม่มี");
    console.log("- แท็บที่แสดง:", Array.from(document.querySelectorAll('[id^="a-content-"]'))
        .filter(el => !el.classList.contains('hidden'))
        .map(el => el.id.replace('a-content-', ''))
        .join(', ') || "ไม่มี");
    
    console.log("\n❤️ 7. สุขภาพการเงิน");
    const healthData = calculateFinancialHealthScore(analysisData);
    console.log("- คะแนน:", healthData.score + "/100");
    console.log("- องค์ประกอบ:", JSON.stringify(healthData.components));
    console.log("- อัตราการออม:", healthData.savingRate.toFixed(1) + "%");
    console.log("- อัตรารายจ่าย:", healthData.expenseRatio.toFixed(1) + "%");
    console.log("- ความถี่:", healthData.transactionFrequency.toFixed(1), "รายการ/วัน");
    
    console.log("\n⚠️ 8. ตรวจสอบปัญหา");
    
    if (analysisData.filtered.length === 0) {
        console.log("❌ ไม่มีข้อมูล transaction ในช่วงเวลานี้");
    }
    
    if (analysisData.totalIncome === 0) {
        console.log("⚠️ ยังไม่มีข้อมูลรายรับ");
    }
    
    if (analysisData.totalExpense === 0) {
        console.log("⚠️ ยังไม่มีข้อมูลรายจ่าย");
    }
    
    const chartElements = [
        'spendingPieChart',
        'incomeExpenseChart',
        'categoryComparisonChart',
        'incomeTrendChart',
        'expenseTrendChart'
    ];
    
    chartElements.forEach(chartId => {
        const element = document.getElementById(chartId);
        if (!element) {
            console.log(`❌ ไม่พบ element: ${chartId}`);
        } else if (!element.parentElement) {
            console.log(`❌ ${chartId} ไม่ได้เชื่อมกับ DOM`);
        }
    });
    
    console.log("\n✅ ===== DEBUG COMPLETE =====");
    console.log("ใช้ debugAnalysisData() เพื่อดูข้อมูลเชิงลึกเพิ่มเติม");
}

function calculateFinancialHealthScore(data) {
    if (!data || data.totalIncome === 0) {
        return {
            score: 0,
            components: {
                saving: 0,
                expense: 0,
                frequency: 0
            },
            savingRate: 0,
            expenseRatio: 0,
            transactionFrequency: 0
        };
    }
    
    const savingRate = data.savingRate || 0;
    let savingScore;
    if (savingRate >= 20) {
        savingScore = 40; 
    } else if (savingRate <= 0) {
        savingScore = 0; 
    } else {
        savingScore = (savingRate / 20) * 40; 
    }
    
    const expenseRatio = data.expenseRatio || 0;
    let expenseScore;
    if (expenseRatio <= 80) {
        expenseScore = 40; 
    } else if (expenseRatio >= 100) {
        expenseScore = 0; 
    } else {
        expenseScore = ((100 - expenseRatio) / 20) * 40;
    }
    
    const transactionFrequency = data.transactionsPerDay || 0;
    let frequencyScore;
    if (transactionFrequency >= 0.5) {
        frequencyScore = 20; 
    } else if (transactionFrequency <= 0) {
        frequencyScore = 0; 
    } else {
        frequencyScore = (transactionFrequency / 0.5) * 20; 
    }
    
    const totalScore = Math.min(100, Math.max(0, 
        savingScore + expenseScore + frequencyScore
    ));
    
    return {
        score: Math.round(totalScore),
        components: {
            saving: Math.round(savingScore),
            expense: Math.round(expenseScore),
            frequency: Math.round(frequencyScore)
        },
        savingRate: savingRate,
        expenseRatio: expenseRatio,
        transactionFrequency: transactionFrequency
    };
}

function updateFinancialHealthScore(data) {
    const healthData = calculateFinancialHealthScore(data);
    const score = healthData.score;
    
    const scoreElement = document.getElementById('financialHealthScore');
    if (scoreElement) {
        scoreElement.innerText = `${score}/100`;
        
        if (score >= 80) {
            scoreElement.style.color = '#10b981'; 
        } else if (score >= 60) {
            scoreElement.style.color = '#f59e0b'; 
        } else if (score >= 40) {
            scoreElement.style.color = '#FFA726'; 
        } else {
            scoreElement.style.color = '#ef4444'; 
        }
    }
    
    const prevData = getPreviousPeriodData();
    if (prevData && prevData.totalIncome > 0) {
        const prevHealthData = calculateFinancialHealthScore(prevData);
        const scoreChange = score - prevHealthData.score;
        
        const iconEl = document.getElementById('healthTrendIcon');
        const textEl = document.getElementById('healthTrendText');
        
        if (iconEl && textEl) {
            if (Math.abs(scoreChange) < 1) {
                iconEl.innerHTML = '→';
                iconEl.className = 'text-xs trend-neutral';
                textEl.textContent = 'ไม่เปลี่ยนแปลง';
                textEl.className = 'text-[8px] trend-neutral';
            } else if (scoreChange > 0) {
                iconEl.innerHTML = '↗';
                iconEl.className = 'text-xs trend-up';
                textEl.textContent = `เพิ่ม ${Math.abs(scoreChange).toFixed(0)} คะแนน`;
                textEl.className = 'text-[8px] trend-up';
            } else {
                iconEl.innerHTML = '↘';
                iconEl.className = 'text-xs trend-down';
                textEl.textContent = `ลด ${Math.abs(scoreChange).toFixed(0)} คะแนน`;
                textEl.className = 'text-[8px] trend-down';
            }
        }
    }
}


function updateAnalysisUI() {
    console.log("=== DEBUG: updateAnalysisUI START ===");
    
    updateAnalysisPeriodText();
    
    const data = getAnalysisData();
    
    updateAnalysisStats(data);

    updateTagPieChart();
    
    const activeTab = document.querySelector('.analysis-tab-btn.active');
    if (!activeTab) {
        document.getElementById('a-tab-overview').classList.add('active');
        document.getElementById('a-content-overview').classList.remove('hidden');
    } else {
        const tabId = activeTab.id.replace('a-tab-', '');
        
        switch(tabId) {
            case 'overview':
                updateSpendingPieChart(data);
                updateIncomeExpenseChart(data);
                break;
            case 'categories':
                updateTopCategoriesList(data);
                updateCategoryComparisonChart(data);
                break;
            case 'trends':
                updateIncomeTrendChart(data);
                updateExpenseTrendChart(data);
                updateSpendingFrequency(data);
                break;
            case 'insights':
                updateInsights(data);
                updateRecommendations(data);
                updateSummaryInsights(data);
                break;
        }
    }
    
    console.log("=== DEBUG: updateAnalysisUI END ===");
}

function getSpendingByDayOfWeek(filteredTransactions) {
    const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    const result = [];
    
    for (let i = 0; i < days.length; i++) {
        result.push({ 
            day: days[i], 
            amount: 0, 
            count: 0 
        });
    }
    
    const expenses = filteredTransactions.filter(t => 
        t.type === 'expense'  
    );
    
    expenses.forEach(t => {
        const date = new Date(t.rawDate);
        const dayOfWeek = date.getDay(); 
        
        if (dayOfWeek >= 0 && dayOfWeek < 7) {
            result[dayOfWeek].amount += t.amount;
            result[dayOfWeek].count++;
        }
    });
    
    return result;
}

function updateAnalysisPeriodText() {
            let periodText = '';
            const year = analysisDate.getFullYear();
            const month = analysisDate.getMonth();
            
            switch(analysisPeriod) {
                case 'month':
                    periodText = `${monthFullNames[month]} ${year}`;
                    break;
                case 'quarter':
                    const quarter = Math.floor(month / 3) + 1;
                    periodText = `ไตรมาสที่ ${quarter} ${year}`;
                    break;
                case 'year':
                    periodText = `ปี ${year}`;
                    break;
            }
            
            document.getElementById('analysisPeriodText').innerText = periodText;
        }

function updateAnalysisStats(data) {
    document.getElementById('avgIncomePerDay').innerText = `฿${Math.round(data.avgIncomePerDay).toLocaleString()}`;
    document.getElementById('avgExpensePerDay').innerText = `฿${Math.round(data.avgExpensePerDay).toLocaleString()}`;
    const investmentActual = data.expense.filter(t => 
    customCategories.investment.some(c => c.label === t.category)
).reduce((sum, t) => sum + t.amount, 0);

const investmentRate = data.totalIncome > 0 ? 
    (investmentActual / data.totalIncome) * 100 : 0;

document.getElementById('investmentRate').innerText = `${investmentRate.toFixed(1)}%`;
    document.getElementById('transactionsPerDay').innerText = data.transactionsPerDay.toFixed(1);
    
    const prevData = getPreviousPeriodData();
    updateTrendIndicators(data, prevData);
    
    updateFinancialHealthScore(data);
}

        function getPreviousPeriodData() {
    const prevDate = new Date(analysisDate);
    
    switch(analysisPeriod) {
        case 'month':
            prevDate.setMonth(prevDate.getMonth() - 1);
            break;
        case 'quarter':
            prevDate.setMonth(prevDate.getMonth() - 3);
            break;
        case 'year':
            prevDate.setFullYear(prevDate.getFullYear() - 1);
            break;
    }
    
    const originalDate = new Date(analysisDate);
    
    const tempDate = analysisDate;
    analysisDate = prevDate;
    const prevData = getAnalysisData();
    
    analysisDate = originalDate;
    
    return prevData;
}

        function updateTrendIndicators(currentData, prevData) {
            const incomeChange = prevData.totalIncome > 0 ? 
                ((currentData.totalIncome - prevData.totalIncome) / prevData.totalIncome) * 100 : 0;
            updateTrendElement('income', incomeChange);
            
            const expenseChange = prevData.totalExpense > 0 ? 
                ((currentData.totalExpense - prevData.totalExpense) / prevData.totalExpense) * 100 : 0;
            updateTrendElement('expense', expenseChange);
            
const currentInvestmentActual = currentData.expense.filter(t => 
    customCategories.investment.some(c => c.label === t.category)
).reduce((sum, t) => sum + t.amount, 0);

const prevInvestmentActual = prevData.expense.filter(t => 
    customCategories.investment.some(c => c.label === t.category)
).reduce((sum, t) => sum + t.amount, 0);

const currentInvestmentRate = currentData.totalIncome > 0 ? 
    (currentInvestmentActual / currentData.totalIncome) * 100 : 0;
const prevInvestmentRate = prevData.totalIncome > 0 ? 
    (prevInvestmentActual / prevData.totalIncome) * 100 : 0;

const investmentChange = currentInvestmentRate - prevInvestmentRate;
updateTrendElement('investment', investmentChange);
            
            const transChange = prevData.filtered.length > 0 ? 
                ((currentData.filtered.length - prevData.filtered.length) / prevData.filtered.length) * 100 : 0;
            updateTrendElement('trans', transChange);
        }

        function updateTrendElement(type, change) {
            const iconEl = document.getElementById(`${type}TrendIcon`);
            const textEl = document.getElementById(`${type}TrendText`);
            
            if (Math.abs(change) < 0.1) {
                iconEl.innerHTML = '→';
                iconEl.className = 'text-xs trend-neutral';
                textEl.textContent = 'ไม่เปลี่ยนแปลง';
                textEl.className = 'text-[15px] trend-neutral';
                return;
            }
            
            if (change > 0) {
                iconEl.innerHTML = '↗';
                iconEl.className = 'text-xs trend-up';
                textEl.textContent = `เพิ่ม ${Math.abs(change).toFixed(1)}%`;
                textEl.className = 'text-[15px] trend-up';
            } else {
                iconEl.innerHTML = '↘';
                iconEl.className = 'text-xs trend-down';
                textEl.textContent = `ลด ${Math.abs(change).toFixed(1)}%`;
                textEl.className = 'text-[15px] trend-down';
            }
        }


function updateSpendingPieChart(data) {
    console.log('📊 updateSpendingPieChart() called');
    
    const container = document.getElementById('pieChartCategoriesContainer');
    const canvas = document.getElementById('spendingPieChart');
    
    if (!container) {
        console.error('❌ ไม่พบ container ของ spendingPieChart');
        return;
    }
    
    const hasData = Object.keys(data.spendingByCategory).length > 0;
    
    if (!hasData) {
        console.log('⚠️ No data for spendingPieChart - HIDING canvas');
        
        if (canvas) {
            canvas.style.display = 'none';
        }
        
        const existingMessage = container.querySelector('.no-data-message-pie');
        if (existingMessage) {
            return;
        }
        
        const message = document.createElement('div');
        message.className = 'no-data-message-pie h-64 flex items-center justify-center text-slate-400 text-sm italic';
        message.textContent = 'ไม่มีข้อมูลรายจ่าย';
        container.appendChild(message);
        
        return;
    }
    
    console.log('✅ Has data for pie chart');
    
    const noDataMsg = container.querySelector('.no-data-message-pie');
    if (noDataMsg) {
        noDataMsg.remove();
    }
    
    if (canvas) {
        canvas.style.display = 'block';
    } else {
        const newCanvas = document.createElement('canvas');
        newCanvas.id = 'spendingPieChart';
        container.appendChild(newCanvas);
    }
    
    const ctx = document.getElementById('spendingPieChart').getContext('2d');
    
    const categories = Object.entries(data.spendingByCategory)
        .map(([category, info]) => ({
            label: category,
            amount: info.amount,
            icon: info.icon
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 8);
    
    const labels = categories.map(c => `${c.icon} ${c.label}`);
    const amounts = categories.map(c => c.amount);
    const colors = generateColors(categories.length);
    
    if (analysisCharts.spendingPie) {
        analysisCharts.spendingPie.data.labels = labels;
        analysisCharts.spendingPie.data.datasets[0].data = amounts;
        analysisCharts.spendingPie.data.datasets[0].backgroundColor = colors;
        analysisCharts.spendingPie.update();
    } else {
        analysisCharts.spendingPie = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: amounts,
                    backgroundColor: colors,
                    borderWidth: 1,
                    borderColor: '#1e293b'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#ffffff',  
                            font: {
                                size: 10
                            },
                            padding: 10
                            
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `฿${value.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}

   function updateIncomeExpenseChart(data) {
    console.log('📈 updateIncomeExpenseChart() called');
    
    const container = document.getElementById('incomeExpenseChart')?.parentElement;
    const canvas = document.getElementById('incomeExpenseChart');
    
    console.log('🔍 DOM Elements:', {
        container: !!container,
        canvas: !!canvas,
        containerId: container?.id,
        canvasId: canvas?.id
    });
    
    if (!container) {
        console.error('❌ ไม่พบ container ของ incomeExpenseChart');
        return;
    }
    
    const trends = data.monthlyTrends;
    
    console.log('📊 Trends data check:', {
        totalTrends: trends.length,
        hasIncome: trends.some(t => t.income > 0),
        hasExpense: trends.some(t => t.expense > 0),
        accountFilter: accountFilterId,
        sampleData: trends.slice(0, 2)
    });
    
    const hasData = trends.length > 0 && 
                   trends.some(t => t.income > 0 || t.expense > 0);
    
    console.log('✅ Has data for chart?', hasData);
    
    if (!hasData) {
        console.log('⚠️ No data for incomeExpenseChart - HIDING canvas');
        
        if (canvas) {
            canvas.style.display = 'none';
            console.log('👁️ Canvas hidden');
        }
        
        const existingMessage = container.querySelector('.no-data-message');
        if (existingMessage) {
            console.log('📝 Existing no-data message found');
            return; 
        }
        
        console.log('✏️ Creating no-data message');
        const message = document.createElement('div');
        message.className = 'no-data-message h-64 flex items-center justify-center text-slate-400 text-sm italic';
        message.textContent = 'ไม่มีข้อมูลแนวโน้ม';
        
        container.appendChild(message);
        
        return; 
    }
    
    console.log('🎯 Has data, showing chart...');
    
    const noDataMsg = container.querySelector('.no-data-message');
    if (noDataMsg) {
        console.log('🗑️ Removing no-data message');
        noDataMsg.remove();
    }
    
    if (canvas) {
        canvas.style.display = 'block';
        console.log('👁️ Canvas shown');
    } else {
        console.log('🔄 Canvas not found, creating new one');
        const newCanvas = document.createElement('canvas');
        newCanvas.id = 'incomeExpenseChart';
        newCanvas.style.display = 'block';
        container.appendChild(newCanvas);
        console.log('✅ New canvas created');
    }
    
    const ctx = document.getElementById('incomeExpenseChart').getContext('2d');
    if (!ctx) {
        console.error('❌ Cannot get canvas context');
        return;
    }
    
    const labels = trends.map(t => t.month);
    const incomeData = trends.map(t => t.income);
    const expenseData = trends.map(t => t.expense);
    
    console.log('📊 Chart data prepared:', {
        labels: labels,
        incomeData: incomeData,
        expenseData: expenseData
    });
    
    if (analysisCharts.incomeExpense) {
        console.log('↻ Updating existing chart');
        
        try {
            analysisCharts.incomeExpense.data.labels = labels;
            analysisCharts.incomeExpense.data.datasets[0].data = incomeData;
            analysisCharts.incomeExpense.data.datasets[1].data = expenseData;
            analysisCharts.incomeExpense.update('none'); 
            console.log('✅ Chart updated');
        } catch (updateError) {
            console.error('❌ Chart update failed:', updateError);
            analysisCharts.incomeExpense.destroy();
            analysisCharts.incomeExpense = null;
            createNewChart(ctx, labels, incomeData, expenseData);
        }
    } else {
        console.log('🆕 Creating new chart');
        createNewChart(ctx, labels, incomeData, expenseData);
    }
    
    function createNewChart(context, labels, incomeData, expenseData) {
        try {
            analysisCharts.incomeExpense = new Chart(context, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'รายได้',
                            data: incomeData,
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            tension: 0.3,
                            fill: true,
                            borderWidth: 2
                        },
                        {
                            label: 'รายจ่าย',
                            data: expenseData,
                            borderColor: '#ef4444',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            tension: 0.3,
                            fill: true,
                            borderWidth: 2
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 0 
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                color: '#ffffff',
                                font: { 
                                    size: 10,
                                    family: "'Kanit', sans-serif"
                                },
                                padding: 10
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            titleColor: '#ffffff',
                            bodyColor: '#e2e8f0',
                            borderColor: '#475569',
                            borderWidth: 1,
                            cornerRadius: 8
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)',
                                drawBorder: false
                            },
                            ticks: {
                                color: '#ffffff',
                                font: {
                                    size: 9,
                                    family: "'Kanit', sans-serif"
                                },
                                callback: function(value) {
                                    if (value >= 1000000) {
                                        return '฿' + (value / 1000000).toFixed(1) + 'M';
                                    }
                                    if (value >= 1000) {
                                        return '฿' + (value / 1000).toFixed(0) + 'k';
                                    }
                                    return '฿' + value;
                                }
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.05)',
                                drawBorder: false
                            },
                            ticks: {
                                color: '#ffffff',
                                font: {
                                    size: 9,
                                    family: "'Kanit', sans-serif"
                                },
                                maxRotation: 0
                            }
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    elements: {
                        point: {
                            radius: 0, 
                            hoverRadius: 4
                        }
                    }
                }
            });
            console.log('✅ New chart created successfully');
        } catch (chartError) {
            console.error('❌ Failed to create chart:', chartError);
        }
    }
}



        function updateTopCategoriesList(data) {
            const container = document.getElementById('topCategoriesList');
            
            if (data.topCategories.length === 0) {
                container.innerHTML = '<div class="p-8 text-center text-slate-400 italic text-sm">ไม่มีข้อมูลรายจ่าย</div>';
                return;
            }
            
            const totalExpense = data.totalExpense;
            
            container.innerHTML = data.topCategories.map((cat, index) => {
                const percentage = totalExpense > 0 ? (cat.amount / totalExpense) * 100 : 0;
                const width = Math.min(percentage * 2, 100); 
                
                return `
                <div class="space-y-1">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-2">
                            <span class="text-lg">${cat.icon}</span>
                            <span class="font-bold text-sm dark:text-white">${cat.category}</span>
                        </div>
                        <div class="text-right">
                            <div class="font-bold text-sm">฿${cat.amount.toLocaleString()}</div>
                            <div class="text-[10px] text-slate-400">${percentage.toFixed(1)}%</div>
                        </div>
                    </div>
                    <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-700">
                        <div class="h-full bg-indigo-500 rounded-full" style="width: ${width}%"></div>
                    </div>
                </div>`;
            }).join('');
        }

function updateCategoryComparisonChart(data) {
    console.log('📊 updateCategoryComparisonChart() called');
    
    const container = document.getElementById('categoryComparisonChart')?.parentElement;
    const canvas = document.getElementById('categoryComparisonChart');
    
    if (!container) {
        console.error('❌ ไม่พบ container ของ categoryComparisonChart');
        return;
    }
    
    const hasData = data.topCategories.length > 0;
    
    if (!hasData) {
        console.log('⚠️ No data for category comparison chart - HIDING canvas');
        
        if (canvas) {
            canvas.style.display = 'none';
        }
        
        const existingMessage = container.querySelector('.no-data-message-category');
        if (existingMessage) {
            return;
        }
        
        const message = document.createElement('div');
        message.className = 'no-data-message-category h-64 flex items-center justify-center text-slate-400 text-sm italic';
        message.textContent = 'ไม่มีข้อมูลหมวดหมู่';
        container.appendChild(message);
        
        return;
    }
    
    console.log('✅ Has data for category comparison chart');
    
    const noDataMsg = container.querySelector('.no-data-message-category');
    if (noDataMsg) {
        noDataMsg.remove();
    }
    
    if (canvas) {
        canvas.style.display = 'block';
    } else {
        const newCanvas = document.createElement('canvas');
        newCanvas.id = 'categoryComparisonChart';
        container.appendChild(newCanvas);
    }
    
    const ctx = document.getElementById('categoryComparisonChart').getContext('2d');
    
    const top5 = data.topCategories.slice(0, 5);
    const labels = top5.map(c => c.category);
    const amounts = top5.map(c => c.amount);
    const colors = generateColors(top5.length);
    
    if (analysisCharts.categoryComparison) {
        analysisCharts.categoryComparison.data.labels = labels;
        analysisCharts.categoryComparison.data.datasets[0].data = amounts;
        analysisCharts.categoryComparison.data.datasets[0].backgroundColor = colors;
        analysisCharts.categoryComparison.update();
    } else {
        analysisCharts.categoryComparison = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'จำนวนเงิน (บาท)',
                    data: amounts,
                    backgroundColor: colors,
                    borderWidth: 1,
                    borderColor: '#1e293b'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#ffffff',  
                            callback: function(value) {
                                if (value >= 1000) {
                                    return '฿' + (value / 1000).toFixed(0) + 'k';
                                }
                                return '฿' + value;
                            }
                        }
                    },
                    x: {
                        ticks: {
                            color: '#ffffff' 
                        }
                    }
                }
            }
        });
    }
}


function updateIncomeTrendChart(data) {
    console.log('📈 updateIncomeTrendChart() called');
    
    const container = document.getElementById('incomeTrendChart')?.parentElement;
    const canvas = document.getElementById('incomeTrendChart');
    
    if (!container) {
        console.error('❌ ไม่พบ container ของ incomeTrendChart');
        return;
    }
    
    const trends = data.monthlyTrends;
    const hasData = trends.length > 0 && trends.some(t => t.income > 0);
    
    if (!hasData) {
        console.log('⚠️ No data for incomeTrendChart - HIDING canvas');
        
        if (canvas) {
            canvas.style.display = 'none';
        }
        
        const existingMessage = container.querySelector('.no-data-message-income-trend');
        if (existingMessage) {
            return;
        }
        
        const message = document.createElement('div');
        message.className = 'no-data-message-income-trend h-64 flex items-center justify-center text-slate-400 text-sm italic';
        message.textContent = 'ไม่มีข้อมูลแนวโน้มรายได้';
        container.appendChild(message);
        
        return;
    }
    
    console.log('✅ Has data for income trend chart');
    
    const noDataMsg = container.querySelector('.no-data-message-income-trend');
    if (noDataMsg) {
        noDataMsg.remove();
    }
    
    if (canvas) {
        canvas.style.display = 'block';
    } else {
        const newCanvas = document.createElement('canvas');
        newCanvas.id = 'incomeTrendChart';
        container.appendChild(newCanvas);
    }
    
    const ctx = document.getElementById('incomeTrendChart').getContext('2d');
    
    const labels = trends.map(t => t.month);
    const incomeData = trends.map(t => t.income);
    
    if (analysisCharts.incomeTrend) {
        analysisCharts.incomeTrend.data.labels = labels;
        analysisCharts.incomeTrend.data.datasets[0].data = incomeData;
        analysisCharts.incomeTrend.update();
    } else {
        analysisCharts.incomeTrend = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'รายได้',
                            data: incomeData,
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            tension: 0.3,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    color: '#ffffff',  
                                    callback: function(value) {
                                        if (value >= 1000) {
                                            return '฿' + (value / 1000).toFixed(0) + 'k';
                                        }
                                        return '฿' + value;
                                    }
                                }
                            },
                            x: {
                            ticks: {
                                color: '#ffffff'  
                                }
                            }
                        }
                    }
                });
            }
        }

function updateExpenseTrendChart(data) {
    console.log('📉 updateExpenseTrendChart() called');
    
    const container = document.getElementById('expenseTrendChart')?.parentElement;
    const canvas = document.getElementById('expenseTrendChart');
    
    if (!container) {
        console.error('❌ ไม่พบ container ของ expenseTrendChart');
        return;
    }
    
    const trends = data.monthlyTrends;
    const hasData = trends.length > 0 && trends.some(t => t.expense > 0);
    
    if (!hasData) {
        console.log('⚠️ No data for expenseTrendChart - HIDING canvas');
        
        if (canvas) {
            canvas.style.display = 'none';
        }
        
        const existingMessage = container.querySelector('.no-data-message-expense-trend');
        if (existingMessage) {
            return;
        }
        
        const message = document.createElement('div');
        message.className = 'no-data-message-expense-trend h-64 flex items-center justify-center text-slate-400 text-sm italic';
        message.textContent = 'ไม่มีข้อมูลแนวโน้มรายจ่าย';
        container.appendChild(message);
        
        return;
    }
    
    console.log('✅ Has data for expense trend chart');
    
    const noDataMsg = container.querySelector('.no-data-message-expense-trend');
    if (noDataMsg) {
        noDataMsg.remove();
    }
    
    if (canvas) {
        canvas.style.display = 'block';
    } else {
        const newCanvas = document.createElement('canvas');
        newCanvas.id = 'expenseTrendChart';
        container.appendChild(newCanvas);
    }
    
    const ctx = document.getElementById('expenseTrendChart').getContext('2d');
    
    const labels = trends.map(t => t.month);
    const expenseData = trends.map(t => t.expense);
    
    if (analysisCharts.expenseTrend) {
        analysisCharts.expenseTrend.data.labels = labels;
        analysisCharts.expenseTrend.data.datasets[0].data = expenseData;
        analysisCharts.expenseTrend.update();
    } else {
        analysisCharts.expenseTrend = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'รายจ่าย',
                            data: expenseData,
                            borderColor: '#ef4444',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            tension: 0.3,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    color: '#ffffff',  
                                    callback: function(value) {
                                        if (value >= 1000) {
                                            return '฿' + (value / 1000).toFixed(0) + 'k';
                                        }
                                        return '฿' + value;
                                    }
                                }
                            },
                             x: {
                                ticks: {
                                    color: '#ffffff'  
                                }
                            }
                        }
                    }
                });
            }
        }

        function updateSpendingFrequency(data) {
            const container = document.getElementById('spendingFrequency');
            const spendingByDay = data.spendingByDayOfWeek;
            
            if (!spendingByDay || spendingByDay.every(d => d.amount === 0)) {
                container.innerHTML = '<div class="p-8 text-center text-slate-400 italic text-sm">ไม่มีข้อมูลความถี่ในการใช้จ่าย</div>';
                return;
            }
            
            const maxAmount = Math.max(...spendingByDay.map(d => d.amount));
            
            container.innerHTML = spendingByDay.map(day => {
                const percentage = maxAmount > 0 ? (day.amount / maxAmount) * 100 : 0;
                
                return `
                <div class="space-y-1">
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-sm dark:text-white">วัน${day.day}</span>
                        <div class="text-right">
                            <div class="font-bold text-sm">฿${day.amount.toLocaleString()}</div>
                            <div class="text-[10px] text-slate-400">${day.count} รายการ</div>
                        </div>
                    </div>
                    <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-700">
                        <div class="h-full bg-amber-500 rounded-full" style="width: ${percentage}%"></div>
                    </div>
                </div>`;
            }).join('');
        }

function calculate3MonthAverage(monthIndex) {
    const currentYear = analysisDate.getFullYear();
    let totalIncome = 0;
    let totalExpense = 0;
    let monthCount = 0;
    
    for (let i = 0; i < 3; i++) {
        const targetMonth = monthIndex - i;
        const year = currentYear;
        let actualMonth = targetMonth;
        let actualYear = year;
        
        if (actualMonth < 0) {
            actualMonth += 12;
            actualYear -= 1;
        }
        
        const monthKey = `${actualYear}-${String(actualMonth + 1).padStart(2, '0')}`;
        const monthTransactions = transactions.filter(t => t.monthKey === monthKey);
        
        if (monthTransactions.length > 0) {
            const monthIncome = monthTransactions.filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
            const monthExpense = monthTransactions.filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);
            
            totalIncome += monthIncome;
            totalExpense += monthExpense;
            monthCount++;
        }
    }
    
    return {
        avgIncome: monthCount > 0 ? totalIncome / monthCount : 0,
        avgExpense: monthCount > 0 ? totalExpense / monthCount : 0,
        monthCount: monthCount
    };
}

        function updateInsights(data) {
            const container = document.getElementById('insightsContainer');
    if (!data) {
        container.innerHTML = '<div class="p-8 text-center text-slate-400 italic text-sm">ไม่มีข้อมูลสำหรับการวิเคราะห์</div>';
        return;
    }
    
    if (!data.expense || data.expense.length === 0) {
        container.innerHTML = '<div class="p-8 text-center text-slate-400 italic text-sm">ไม่มีข้อมูลรายจ่ายสำหรับการวิเคราะห์</div>';
        return;
    }

            const insights = [];
    const tagInsights = updateTagInsights(data);
    insights.push(...tagInsights);
            
    
    const currentMonth = analysisDate.getMonth();
    const currentYear = analysisDate.getFullYear();
    let last3MonthsExpense = 0;
    let monthCount = 0;
    
    for (let i = 0; i < 3; i++) {
        const month = currentMonth - i;
        const year = currentYear;
        let actualMonth = month;
        let actualYear = year;
        
        if (actualMonth < 0) {
            actualMonth += 12;
            actualYear -= 1;
        }
        
        const monthKey = `${actualYear}-${String(actualMonth + 1).padStart(2, '0')}`;
        const monthExpense = transactions
            .filter(t => t.monthKey === monthKey && t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        if (monthExpense > 0) {
            last3MonthsExpense += monthExpense;
            monthCount++;
        }
    }
    
    const avgExpenseLast3Months = monthCount > 0 ? last3MonthsExpense / monthCount : 0;
    
    if (avgExpenseLast3Months > 0 && monthCount >= 2) {
        const comparison = ((data.totalExpense - avgExpenseLast3Months) / avgExpenseLast3Months) * 100;
        
        if (Math.abs(comparison) >= 10) {
            const direction = comparison > 0 ? 'เพิ่มขึ้น' : 'ลดลง';
            const type = comparison > 30 ? 'warning' : (comparison > 15 ? 'info' : 'info');
            
            insights.push({
                icon: '📊',
                title: 'เปรียบเทียบ 3 เดือน',
                content: `รายจ่าย${direction} ${Math.abs(comparison).toFixed(1)}% จากค่าเฉลี่ย 3 เดือน`,
                type: type
            });
        }
    }


            if (data.topCategories.length > 0) {
                const topCat = data.topCategories[0];
                const percentage = (topCat.amount / data.totalExpense) * 100;
                insights.push({
                    icon: '💰',
                    title: 'หมวดหมู่ที่ใช้งามากที่สุด',
                    content: `${topCat.category} (${topCat.icon}) ใช้งบประมาณ ${percentage.toFixed(1)}% ของรายจ่ายทั้งหมด (฿${topCat.amount.toLocaleString()})`,
                    type: percentage > 40 ? 'warning' : 'info'
                });
            }
            
const investmentRate = data.savingRate; 

if (investmentRate >= 20) {
    insights.push({
        icon: '📈',
        title: 'อัตราการลงทุนดีเยี่ยม',
        content: `อัตราการลงทุน ${investmentRate.toFixed(1)}% สูงกว่าเป้าหมายมาตรฐาน 20%`,
        type: 'success'
    });
} else if (investmentRate > 0) {
    insights.push({
        icon: '📊',
        title: 'อัตราการลงทุนปานกลาง',
        content: `อัตราการลงทุน ${investmentRate.toFixed(1)}% ควรตั้งเป้าให้ได้อย่างน้อย 20%`,
        type: 'info'
    });
} else {
    insights.push({
        icon: '⚠️',
        title: 'ยังไม่มีเงินลงทุน',
        content: `คุณยังไม่ได้จัดสรรเงินสำหรับการลงทุนในเดือนนี้`,
        type: 'warning'
    });
}
            
            if (data.avgExpensePerDay > data.avgIncomePerDay * 0.8) {
                insights.push({
                    icon: '⚡',
                    title: 'ค่าใช้จ่ายต่อวันสูง',
                    content: `ค่าใช้จ่ายเฉลี่ยต่อวัน ฿${Math.round(data.avgExpensePerDay).toLocaleString()} สูงกว่าค่าเฉลี่ยที่แนะนำ`,
                    type: 'warning'
                });
            }
            
            if (data.transactionsPerDay < 0.5) {
                insights.push({
                    icon: '📝',
                    title: 'ความถี่ในการบันทึกต่ำ',
                    content: `บันทึกรายการเฉลี่ย ${data.transactionsPerDay.toFixed(1)} รายการ/วัน ควรบันทึกให้บ่อยขึ้นเพื่อความแม่นยำ`,
                    type: 'info'
                });
            }
            
let maxSpendingDay = {amount: 0, day: 'ไม่มีข้อมูล'};
if (data.spendingByDayOfWeek && data.spendingByDayOfWeek.length > 0) {
    maxSpendingDay = data.spendingByDayOfWeek.reduce((max, day) => 
        day.amount > max.amount ? day : max, {amount: 0});
}

if (maxSpendingDay.amount > 0) {
    insights.push({
        icon: '📅',
        title: 'วันที่ใช้งามากที่สุด',
        content: `วัน${maxSpendingDay.day} ใช้งบประมาณสูงสุด (฿${maxSpendingDay.amount.toLocaleString()})`,
        type: 'info'
    });
}
            
    const healthData = calculateFinancialHealthScore(data);
    const healthScore = healthData.score;

    if (healthScore > 0) {
        let healthIcon, healthTitle, healthType;
        
        if (healthScore >= 80) {
            healthIcon = '🏆';
            healthTitle = 'สุขภาพการเงินดีเยี่ยม';
            healthType = 'success';
        } else if (healthScore >= 60) {
            healthIcon = '👍';
            healthTitle = 'สุขภาพการเงินดี';
            healthType = 'info';
        } else if (healthScore >= 40) {
            healthIcon = '⚠️';
            healthTitle = 'สุขภาพการเงินปานกลาง';
            healthType = 'warning';
        } else {
            healthIcon = '🚨';
            healthTitle = 'สุขภาพการเงินต้องปรับปรุง';
            healthType = 'danger';
        }
        
        insights.push({
            icon: healthIcon,
            title: healthTitle,
            content: `คะแนนสุขภาพการเงิน ${healthScore}/100`,
            type: healthType
        });
    }
            if (insights.length === 0) {
                container.innerHTML = '<div class="p-8 text-center text-slate-400 italic text-sm">ไม่มีข้อมูลเชิงลึก</div>';
                return;
            }
            
            insights.sort((a, b) => {
            if (a.title.includes('TAG')) return -1;
            if (b.title.includes('TAG')) return 1;
            return 0;
        });

            container.innerHTML = insights.map(insight => {
                let badgeClass = 'bg-blue-100 text-blue-800';
                if (insight.type === 'success') badgeClass = 'bg-emerald-100 text-emerald-800';
                if (insight.type === 'warning') badgeClass = 'bg-amber-100 text-amber-800';
                if (insight.type === 'danger') badgeClass = 'bg-rose-100 text-rose-800';
                
                return `
                <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <div class="flex items-start gap-3">
                        <div class="text-2xl">${insight.icon}</div>
                        <div class="flex-grow">
                            <div class="flex justify-between items-start">
                                <h4 class="font-bold text-sm dark:text-white">${insight.title}</h4>
                                <span class="insight-badge ${badgeClass} rounded-full font-bold">${insight.type}</span>
                            </div>
                            <p class="text-xs text-slate-600 dark:text-slate-300 mt-1">${insight.content}</p>
                        </div>
                    </div>
                </div>`;
            }).join('');
        }

        function updateRecommendations(data) {
            const container = document.getElementById('recommendationsContainer');
            const recommendations = [];
            
            if (data.savingRate < 20 && data.savingRate > 0) {
                recommendations.push({
                    icon: '🎯',
                    title: 'เพิ่มอัตราการออมการลงทุน',
                    content: 'พยายามลดรายจ่ายที่ไม่จำเป็นลง 10-15% เพื่อให้อัตราการออมการลงทุนถึง 20%'
                });
            }
            
            if (data.savingRate < 0) {
                recommendations.push({
                    icon: '🚨',
                    title: 'จัดการหนี้สินเร่งด่วน',
                    content: 'คุณใช้งจ่ายเกินรายได้ ควรลดรายจ่ายหรือหารายได้เพิ่มทันที'
                });
            }
            
            if (data.topCategories.length > 0) {
                const topCat = data.topCategories[0];
                const percentage = (topCat.amount / data.totalExpense) * 100;
                if (percentage > 40) {
                    recommendations.push({
                        icon: '📉',
                        title: 'กระจายรายจ่าย',
                        content: `หมวดหมู่ ${topCat.category} ใช้งบประมาณมากเกินไป (${percentage.toFixed(1)}%) พิจารณาลดลง`
                    });
                }
            }
            
            if (data.avgExpensePerDay > data.avgIncomePerDay * 0.8) {
                recommendations.push({
                    icon: '📊',
                    title: 'ควบคุมรายจ่ายรายวัน',
                    content: 'ตั้งเป้ารายจ่ายรายวันไม่เกิน 80% ของรายได้รายวัน'
                });
            }
            
            if (data.filtered.length < 10) {
                recommendations.push({
                    icon: '📝',
                    title: 'บันทึกรายการให้มากขึ้น',
                    content: 'บันทึกรายการให้ครบทุกครั้งเพื่อการวิเคราะห์ที่แม่นยำ'
                });
            }
            
    const healthData = calculateFinancialHealthScore(data);
    const healthScore = healthData.score;

    if (healthScore > 0 && healthScore < 80) {
        if (healthData.components.saving < 30) {
            recommendations.push({
                icon: '💰',
                title: 'เพิ่มการออมการลงทุน',
                content: `อัตราการออมการลงทุนปัจจุบัน ${healthData.savingRate.toFixed(1)}% (ได้ ${healthData.components.saving}/40 คะแนน) - พยายามออมหรือลงทุนให้ได้ 20%`
            });
        }
        
        if (healthData.components.expense < 30) {
            recommendations.push({
                icon: '📉',
                title: 'ควบคุมรายจ่าย',
                content: `รายจ่าย ${healthData.expenseRatio.toFixed(1)}% ของรายได้ (ได้ ${healthData.components.expense}/40 คะแนน) - พยายามลดลงเหลือไม่เกิน 80%`
            });
        }
        
        if (healthData.components.frequency < 15) {
            recommendations.push({
                icon: '📝',
                title: 'บันทึกรายการบ่อยขึ้น',
                content: `บันทึกรายการเฉลี่ย ${healthData.transactionFrequency.toFixed(1)} รายการ/วัน (ได้ ${healthData.components.frequency}/20 คะแนน) - พยายามบันทึกวันละ 0.5 รายการ`
            });
        }
    }
            if (recommendations.length === 0) {
                recommendations.push({
                    icon: '✅',
                    title: 'การเงินอยู่ในเกณฑ์ดี',
                    content: 'รักษาวินัยทางการเงินอย่างนี้ต่อไป'
                });
            }
            
            container.innerHTML = recommendations.map(rec => `
                <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div class="flex items-center gap-2">
                        <div class="text-xl">${rec.icon}</div>
                        <div>
                            <h4 class="font-bold text-sm dark:text-white">${rec.title}</h4>
                            <p class="text-xs text-slate-600 dark:text-slate-300">${rec.content}</p>
                        </div>
                    </div>
                </div>
            `).join('');
        }

function updateSummaryInsights(data) {
    const container = document.getElementById('summaryInsights');
    
    if (!data || !data.filtered) {
        container.innerHTML = `
            <div class="grid grid-cols-2 gap-3">
                <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                    <div class="text-2xl font-bold" style="color: #93D9F1">0</div>
                    <div class="text-[10px] text-slate-500">รายการทั้งหมด</div>
                </div>
                <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                    <div class="text-2xl font-bold text-emerald-600">0</div>
                    <div class="text-[10px] text-slate-500">รายการรายได้</div>
                </div>
                <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                    <div class="text-2xl font-bold text-rose-600">0</div>
                    <div class="text-[10px] text-slate-500">รายการรายจ่าย</div>
                </div>
                <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                    <div class="text-2xl font-bold text-amber-600">฿0</div>
                    <div class="text-[10px] text-slate-500">ค่าเฉลี่ยต่อรายการ</div>
                </div>
            </div>
            <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center mt-3">
                <div class="text-xs font-bold text-slate-500">ไม่มีข้อมูลสำหรับสรุป</div>
            </div>`;
        return;
    }
    
    const summary = {
        totalTransactions: data.filtered?.length || 0,
        incomeTransactions: data.income?.length || 0,
        expenseTransactions: data.expense?.length || 0,
        avgTransactionAmount: (data.filtered?.length || 0) > 0 ? 
            ((data.totalIncome || 0) + (data.totalExpense || 0)) / data.filtered.length : 0,
        mostActiveDay: (data.spendingByDayOfWeek && data.spendingByDayOfWeek.length > 0) 
            ? data.spendingByDayOfWeek.reduce((max, day) => 
                day.count > max.count ? day : max, {count: 0, day: 'ไม่มีข้อมูล'}).day 
            : 'ไม่มีข้อมูล'
    };
    
    container.innerHTML = `
        <div class="grid grid-cols-2 gap-3">
            <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                <div class="text-2xl font-bold" style="color: #93D9F1">${summary.totalTransactions}</div>
                <div class="text-[10px] text-slate-500">รายการทั้งหมด</div>
            </div>
            <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                <div class="text-2xl font-bold text-emerald-600">${summary.incomeTransactions}</div>
                <div class="text-[10px] text-slate-500">รายการรายได้</div>
            </div>
            <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                <div class="text-2xl font-bold text-rose-600">${summary.expenseTransactions}</div>
                <div class="text-[10px] text-slate-500">รายการรายจ่าย</div>
            </div>
            <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                <div class="text-2xl font-bold text-amber-600">฿${Math.round(summary.avgTransactionAmount).toLocaleString()}</div>
                <div class="text-[10px] text-slate-500">ค่าเฉลี่ยต่อรายการ</div>
            </div>
        </div>
        <div class="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-center mt-3">
            <div class="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                ${summary.mostActiveDay === 'ไม่มีข้อมูล' 
                    ? 'ไม่มีข้อมูลวันที่บันทึกบ่อย' 
                    : `วัน${summary.mostActiveDay} คือวันที่บันทึกรายการบ่อยที่สุด`}
            </div>
        </div>`;
}

function ensureChartContainer(chartId) {
            const container = document.getElementById(chartId).parentElement;
            const canvas = document.getElementById(chartId);
            
            console.log(`🔧 Checking container for ${chartId}`);
            
            if (!canvas || !container.contains(canvas)) {
                console.log(`🔄 Recreating canvas for ${chartId}`);
                
                container.innerHTML = '';
                
                const newCanvas = document.createElement('canvas');
                newCanvas.id = chartId;
                newCanvas.style.display = 'block';
                container.appendChild(newCanvas);
                
                return newCanvas;
            }
            
            return canvas;
        }

        function generateColors(count) {
            const colors = [
                '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
                '#06b6d4', '#84cc16', '#f97316', '#6366f1', '#ec4899',
                '#14b8a6', '#f43f5e', '#0ea5e9', '#22c55e', '#eab308'
            ];
            
            const result = [];
            for (let i = 0; i < count; i++) {
                result.push(colors[i % colors.length]);
            }
            
            return result;
        }

function refreshAnalysisCharts() {
    console.log("🔄 refreshAnalysisCharts START");
    
    if (!document.getElementById('page-analysis').classList.contains('hidden')) {
        try {
            const data = getAnalysisData();
            updateAnalysisStats(data);
            
            const activeTab = document.querySelector('.analysis-tab-btn.active');
            if (!activeTab) {
                document.getElementById('a-tab-overview').classList.add('active');
                document.getElementById('a-content-overview').classList.remove('hidden');
                switchAnalysisTab('overview');
                return;
            }
            
            const tabId = activeTab.id.replace('a-tab-', '');
            
            switch(tabId) {
                case 'overview':
                    updateSpendingPieChart(data);
                    updateTagPieChart();
                    updateIncomeExpenseChart(data);
                    break;
                    
                case 'categories':
                    updateTopCategoriesList(data);
                    updateCategoryComparisonChart(data);
                    break;
                    
                case 'tags':  
                    updateTagAnalysisUI();
                    break;
                    
                case 'trends':
                    updateIncomeTrendChart(data);
                    updateExpenseTrendChart(data);
                    updateSpendingFrequency(data);
                    break;
                    
                case 'insights':
                    updateInsights(data);
                    updateRecommendations(data);
                    updateSummaryInsights(data);
                    break;
            }
            
        } catch (error) {
            console.error('❌ Error in refreshAnalysisCharts:', error);
        }
    }
    
    console.log("✅ refreshAnalysisCharts END");
}
function switchAnalysisTab(tab) {
    document.querySelectorAll('.analysis-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`a-tab-${tab}`).classList.add('active');
    
    document.querySelectorAll('[id^="a-content-"]').forEach(el => {
        el.classList.add('hidden');
    });
    
    document.getElementById(`a-content-${tab}`).classList.remove('hidden');
    
    if (document.getElementById('page-analysis') && 
        !document.getElementById('page-analysis').classList.contains('hidden')) {
        refreshAnalysisCharts();

    }
}

function changeAnalysisPeriod(step) {
    switch(analysisPeriod) {
        case 'month':
            analysisDate.setMonth(analysisDate.getMonth() + step);
            break;
        case 'quarter':
            analysisDate.setMonth(analysisDate.getMonth() + (step * 3));
            break;
        case 'year':
            analysisDate.setFullYear(analysisDate.getFullYear() + step);
            break;
    }
    
    const activeTab = document.querySelector('.analysis-tab-btn.active');
    if (activeTab) {
        const tabId = activeTab.id.replace('a-tab-', '');
        
        if (tabId === 'tags') {
            updateTagAnalysisUI();
        } else {
            updateAnalysisUI();
        }
    } else {
        updateAnalysisUI();
    }
}

function changeDebtPeriod(step) {
    switch(debtPeriod) {
        case 'month':
            debtDate.setMonth(debtDate.getMonth() + step);
            break;
        case 'quarter':
            debtDate.setMonth(debtDate.getMonth() + (step * 3));
            break;
        case 'year':
            debtDate.setFullYear(debtDate.getFullYear() + step);
            break;
        case 'all':
            break;
    }
    
    updateDebtPeriodText();
    renderDebtPage(); 
}

function changeAnalysisPeriodType() {
            const select = document.getElementById('analysisPeriodSelect');
            analysisPeriod = select.value;
            analysisDate = new Date(); 
            updateAnalysisUI();
        }



function updateYearlyUI() {
    document.getElementById('displayYearText').innerText = displayYear;
    
    const inc = Array(12).fill(0);  
    const inv = Array(12).fill(0);  
    const spd = Array(12).fill(0); 
    
    const incomeByCategory = {};
    customCategories.income.forEach(cat => {
        incomeByCategory[cat.label] = Array(12).fill(0);
    });
    
    const dCat = {};
    [...customCategories.spending, ...customCategories.investment].forEach(c => dCat[c.label] = Array(12).fill(0));

    let sourceTransactions = getCurrentTransactions();
    
    const filteredTransactions = accountFilterId !== 'all' 
        ? sourceTransactions.filter(t => 
            t.accountId === accountFilterId ||  
            (t.type === 'transfer' && t.transferToAccountId === accountFilterId)
          )
        : sourceTransactions;
    
    filteredTransactions.forEach(t => { 
        const parts = t.monthKey.split('-');
        const y = parseInt(parts[0]);
        const m = parseInt(parts[1]);
        if(y === displayYear) { 
            if(t.type === 'income') {
                inc[m-1] += t.amount; 
                if (incomeByCategory[t.category] !== undefined) {
                    incomeByCategory[t.category][m-1] += t.amount;
                }
            } 
            else if(t.type === 'expense') {
                if(customCategories.investment.some(c => c.label === t.category)) { 
                    inv[m-1] += t.amount; 
                    if(dCat[t.category]) dCat[t.category][m-1] += t.amount; 
                } else { 
                    spd[m-1] += t.amount; 
                    if(dCat[t.category]) dCat[t.category][m-1] += t.amount; 
                } 
            }
        } 
    });
    
    const mSumSpending = Array(12).fill(0);  
    const mSumInvestment = Array(12).fill(0); 
    
    customCategories.spending.forEach(c => {
        if (dCat[c.label]) {
            dCat[c.label].forEach((v, i) => mSumSpending[i] += v);
        }
    });
    
    customCategories.investment.forEach(c => {
        if (dCat[c.label]) {
            dCat[c.label].forEach((v, i) => mSumInvestment[i] += v);
        }
    });
    
    const tSumSpending = mSumSpending.reduce((a,b)=>a+b,0);
    const tSumInvestment = mSumInvestment.reduce((a,b)=>a+b,0);
    const tSumInc = inc.reduce((a,b)=>a+b,0);
    
    const mOver = inc.map((inV, i) => Math.max(0, (mSumSpending[i] + mSumInvestment[i]) - inV));
    const mRem = inc.map((inV, i) => Math.max(0, inV - (mSumSpending[i] + mSumInvestment[i])));
    const tOver = mOver.reduce((a,b)=>a+b,0);
    const tRem = mRem.reduce((a,b)=>a+b,0);
    
    let html = '';
    
    customCategories.spending.forEach(c => {
        const mV = dCat[c.label] || Array(12).fill(0); 
        const rowTotal = mV.reduce((a,b)=>a+b,0);
        if (rowTotal > 0) { 
            html += `<tr>
                <td class="px-4 py-3 font-bold sticky left-0 z-10 bg-white dark:bg-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800">
                    ${c.icon} ${c.label}
                </td>`;
                
            mV.forEach((v, monthIdx) => {
                if (v > 0) {
                    html += `<td onclick="openYearlyCategoryModal('${c.label}', ${monthIdx}, ${displayYear})" 
                               class="px-3 py-3 text-center text-slate-500 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors relative group">
                                ${v.toLocaleString()}
                                <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                            </td>`;
                } else {
                    html += `<td class="px-3 py-3 text-center text-slate-400">-</td>`;
                }
            });
            
            html += `<td class="px-4 py-3 text-right font-bold text-rose-500 dark:text-rose-400">฿${rowTotal.toLocaleString()}</td>
                <td class="px-4 py-3 text-right text-slate-400">฿${(rowTotal/12).toLocaleString(undefined,{maximumFractionDigits:0})}</td>
            </tr>`;
        }
    });
    
    html += `<tr class="font-bold bg-rose-900/10">
        <td class="px-4 py-3 sticky left-0 z-10 bg-slate-800 text-rose-400">รวมรายจ่าย</td>`;
        
    mSumSpending.forEach((s, monthIdx) => {
        if (s > 0) {
            html += `<td class="px-3 py-3 text-center text-rose-400">
                    ${s.toLocaleString()}
                </td>`;
    } else {
        html += `<td class="px-3 py-3 text-center text-slate-400">-</td>`;
    }
});
    
    html += `<td class="px-4 py-3 text-right text-rose-500">฿${tSumSpending.toLocaleString()}</td>
        <td class="px-4 py-3 text-right text-rose-300">฿${(tSumSpending/12).toLocaleString(undefined,{maximumFractionDigits:0})}</td>
    </tr>`;
    
    html += `<tr class="bg-slate-800/30"><td colspan="15" class="py-1"></td></tr>`;
    
    customCategories.investment.forEach(c => {
        const mV = dCat[c.label] || Array(12).fill(0); 
        const rowTotal = mV.reduce((a,b)=>a+b,0);
        if (rowTotal > 0) { 
            html += `<tr>
                <td class="px-4 py-3 font-bold sticky left-0 z-10 bg-white dark:bg-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800">
                    ${c.icon} ${c.label}
                </td>`;
                
            mV.forEach((v, monthIdx) => {
                if (v > 0) {
                    html += `<td onclick="openYearlyCategoryModal('${c.label}', ${monthIdx}, ${displayYear})" 
                               class="px-3 py-3 text-center text-slate-500 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors relative group">
                                ${v.toLocaleString()}
                                <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                            </td>`;
                } else {
                    html += `<td class="px-3 py-3 text-center text-slate-400">-</td>`;
                }
            });
            
            html += `<td class="px-4 py-3 text-right font-bold text-amber-500 dark:text-amber-400">฿${rowTotal.toLocaleString()}</td>
                <td class="px-4 py-3 text-right text-slate-400">฿${(rowTotal/12).toLocaleString(undefined,{maximumFractionDigits:0})}</td>
            </tr>`;
        }
    });
    
    html += `<tr class="font-bold bg-amber-900/10">
        <td class="px-4 py-3 sticky left-0 z-10 bg-slate-800 text-amber-400">รวมลงทุน</td>`;
        
    mSumInvestment.forEach((s, monthIdx) => {
        if (s > 0) {
            html += `<td class="px-3 py-3 text-center text-amber-400">
                    ${s.toLocaleString()}
                </td>`;
    } else {
        html += `<td class="px-3 py-3 text-center text-slate-400">-</td>`;
    }
});
    
    html += `<td class="px-4 py-3 text-right text-amber-500">฿${tSumInvestment.toLocaleString()}</td>
        <td class="px-4 py-3 text-right text-amber-300">฿${(tSumInvestment/12).toLocaleString(undefined,{maximumFractionDigits:0})}</td>
    </tr>`;
    
    html += `<tr class="bg-slate-800/30"><td colspan="15" class="py-1"></td></tr>`;
    
    customCategories.income.forEach(cat => {
        const monthlyValues = incomeByCategory[cat.label] || Array(12).fill(0);
        const rowTotal = monthlyValues.reduce((a, b) => a + b, 0);
        if (rowTotal > 0) { 
            html += `<tr>
                <td class="px-4 py-3 font-bold sticky left-0 z-10 bg-white dark:bg-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800">
                    ${cat.icon} ${cat.label}
                </td>`;
                
            monthlyValues.forEach((v, monthIdx) => {
                if (v > 0) {
                    html += `<td onclick="openYearlyCategoryModal('${cat.label}', ${monthIdx}, ${displayYear})" 
                               class="px-3 py-3 text-center text-slate-500 cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors relative group">
                                ${v.toLocaleString()}
                                <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                            </td>`;
                } else {
                    html += `<td class="px-3 py-3 text-center text-slate-400">-</td>`;
                }
            });
            
            html += `<td class="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">฿${rowTotal.toLocaleString()}</td>
                <td class="px-4 py-3 text-right text-slate-400">฿${(rowTotal/12).toLocaleString(undefined,{maximumFractionDigits:0})}</td>
            </tr>`;
        }
    });
    
    html += `<tr class="font-bold bg-emerald-900/10">
        <td class="px-4 py-3 sticky left-0 z-10 bg-slate-800 text-emerald-400">รวมรายรับ</td>`;
        
    inc.forEach((s, monthIdx) => {
        if (s > 0) {
            html += `<td class="px-3 py-3 text-center text-emerald-400">
                    ${s.toLocaleString()}
                </td>`;
    } else {
        html += `<td class="px-3 py-3 text-center text-slate-400">-</td>`;
    }
});
    
    html += `<td class="px-4 py-3 text-right text-emerald-500">฿${tSumInc.toLocaleString()}</td>
        <td class="px-4 py-3 text-right text-emerald-300">฿${(tSumInc/12).toLocaleString(undefined,{maximumFractionDigits:0})}</td>
    </tr>`;
    
    html += `<tr class="bg-slate-800/30"><td colspan="15" class="py-1"></td></tr>`;
    
    html += `<tr class="font-bold bg-rose-900/10">
        <td class="px-4 py-3 sticky left-0 z-10 bg-slate-800 text-rose-500">ใช้เกิน (ติดลบ)</td>
        ${mOver.map(s => `<td class="px-3 py-3 text-center text-rose-500">${s > 0 ? '-' + s.toLocaleString() : '-'}</td>`).join('')}
        <td class="px-4 py-3 text-right text-rose-600">฿${tOver > 0 ? '-' + tOver.toLocaleString() : '0'}</td>
        <td class="px-4 py-3 text-right text-rose-500">฿${(tOver/12).toLocaleString(undefined,{maximumFractionDigits:0})}</td>
    </tr>
    <tr class="font-bold bg-emerald-900/30">
        <td class="px-4 py-3 sticky left-0 z-10 bg-slate-800 text-neon-green">คงเหลือ</td>
        ${mRem.map(s => `<td class="px-3 py-3 text-center text-neon-green">${s > 0 ? s.toLocaleString() : '-'}</td>`).join('')}
        <td class="px-4 py-3 text-right cell-highlight-final">฿${tRem.toLocaleString()}</td>
        <td class="px-4 py-3 text-right text-neon-green">฿${(tRem/12).toLocaleString(undefined,{maximumFractionDigits:0})}</td>
    </tr>`;
    
    document.getElementById('yearlyDetailedBody').innerHTML = html;
    
    if (yearlyChart) yearlyChart.destroy();
    yearlyChart = new Chart(document.getElementById('yearlyChart').getContext('2d'), {
        type: 'bar', 
        data: { 
            labels: monthNames, 
            datasets: [
                { label: 'รายได้', data: inc, backgroundColor: '#10b981', barThickness: 12, stack: 's0' }, 
                { label: 'ลงทุน', data: inv, backgroundColor: '#fbbf24', barThickness: 12, stack: 's1' }, 
                { label: 'ใช้จ่าย', data: spd, backgroundColor: '#f43f5e', barThickness: 12, stack: 's1' }
            ] 
        }, 
        options: { 
            responsive: true, 
            maintainAspectRatio: false, 
            plugins: { 
                legend: { display: false } 
            }, 
            scales: { 
                y: { 
                    beginAtZero: true, 
                    grid: { color: '#334155' },
                    ticks: { color: '#ffffff', font: { size: 11 } }
                }, 
                x: { 
                    grid: { display: false },
                    ticks: { color: '#ffffff', font: { size: 11 } }
                } 
            } 
        } 
    });
}

function updateYearlyTagsUI() {
    const tagData = {};

    let sourceTransactions = getCurrentTransactions();
    
const filteredTransactions = accountFilterId !== 'all' 
        ? sourceTransactions.filter(t => 
            t.accountId === accountFilterId ||  
            (t.type === 'transfer' && t.transferToAccountId === accountFilterId)
          )
        : sourceTransactions;
    
filteredTransactions.forEach(t => {
    const parts = t.monthKey.split('-');
    const y = parseInt(parts[0]);
    const m = parseInt(parts[1]);
    
    if (y === displayYear && t.tag && t.tag.trim() !== '') {
        const tag = t.tag.trim();
        if (!tagData[tag]) tagData[tag] = Array(12).fill(0);
        tagData[tag][m-1] += t.amount;
    }
});
            const sortedTags = Object.keys(tagData).sort();
            const body = document.getElementById('yearlyTagsBody');
            if (sortedTags.length === 0) { body.innerHTML = `<tr><td colspan="15" class="p-12 text-center text-slate-400 italic text-xs">ไม่มีข้อมูลการใช้ TAG ในปีนี้</td></tr>`; return; }
            body.innerHTML = sortedTags.map(tag => {
                const monthlyValues = tagData[tag];
                const rowTotal = monthlyValues.reduce((a, b) => a + b, 0);
                const avg = rowTotal / 12;
                return `<tr><td class="px-4 py-3 font-bold sticky left-0 z-10 bg-white dark:bg-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800"># ${tag}</td>${monthlyValues.map(v => `<td class="px-3 py-3 text-center text-slate-500">${v > 0 ? v.toLocaleString() : '-'}</td>`).join('')}<td class="px-4 py-3 text-right font-bold text-amber-600 bg-amber-50/30 dark:text-amber-400 dark:bg-amber-900/10">฿${rowTotal.toLocaleString()}</td><td class="px-4 py-3 text-right text-slate-400">฿${avg.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td></tr>`;
            }).join('');
        }

function switchYearlyTab(tabId) {
    document.querySelectorAll('.yearly-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`y-tab-${tabId}`).classList.add('active');
    document.getElementById('y-content-category').classList.toggle('hidden', tabId !== 'category');
    document.getElementById('y-content-tags').classList.toggle('hidden', tabId !== 'tags');
    
    if (tabId === 'tags') {
        updateYearlyTagsUI(); 
    } else if (tabId === 'category') {
        updateYearlyUI(); 
    }
}



let debts = JSON.parse(localStorage.getItem('fin_debts')) || [];
let payments = JSON.parse(localStorage.getItem('fin_debt_payments')) || [];
let tags = JSON.parse(localStorage.getItem('fin_tags')) || [];  



function renderDebtPage() {
    console.log('📄 renderDebtPage called');
    console.log('📊 debts array:', debts);
    console.log('📊 payments array:', payments);
    console.log('📊 debts count:', debts.length);
    console.log('📊 payments count:', payments.length);
    
    updateDebtSummary();
    switchDebtTab(currentDebtTab);
    
    // ✅ เรียก renderPaymentHistory โดยตรง
    renderPaymentHistory();
}

async function savePayment() {
    // ✅ 1. ดึงค่าจาก DOM elements ก่อน
    const accountId = document.getElementById('paymentAccountSelect').value;
    const amount = parseFloat(document.getElementById('paymentAmount').value);
    const date = document.getElementById('paymentDate').value;
    const note = document.getElementById('paymentNote').value.trim();
    
    // ✅ 2. ตรวจสอบความถูกต้อง
    if (!accountId) {
        showToast('⚠️ กรุณาเลือกบัญชีที่ใช้ชำระ');
        return;
    }
    
    if (!amount || amount <= 0) {
        showToast('⚠️ กรุณาระบุจำนวนเงินที่ถูกต้อง');
        return;
    }
    
    if (!date) {
        showToast('⚠️ กรุณาเลือกวันที่ชำระ');
        return;
    }
    
    // ✅ 3. ตรวจสอบ debt object
    if (!window.currentDebtForPayment) {
        showToast('❌ ไม่พบข้อมูลหนี้');
        return;
    }
    
    const debt = window.currentDebtForPayment;
    const shouldSaveToLocal = saveToLocalEnabled;
    const paymentId = 'payment_' + Date.now();  // temporary ID
    
    try {
        // ✅ 4. บันทึก payment ก่อน (ได้ ID จริง)
        console.log('📤 Step 1: Saving payment to backend...');
        const paymentResult = await saveDebtPaymentToBackend({
            id: paymentId,
            debtId: selectedDebtForPayment,
            accountId: accountId,
            amount: amount,
            date: date,
            note: note
        });
        
        if (!paymentResult || !paymentResult.id) {
            showToast('❌ ไม่สามารถบันทึกการชำระหนี้ได้');
            return;
        }
        
        const realPaymentId = paymentResult.id;
        console.log(`✅ Payment saved with real ID: ${realPaymentId}`);
        
        // ✅ 5. สร้าง transaction ด้วย realPaymentId
        const now = new Date();
        const expenseData = {
            id: 'debt_expense_' + Date.now(),
            amount: amount,
            type: 'expense',
            category: debt.categoryName,
            icon: debt.categoryIcon,
            desc: debt.name + ' (ผ่อนหนี้)',
            tag: debt.tag || '#ผ่อนหนี้',
            rawDate: date,
            monthKey: getMonthKeyFromDate(date),
            date: date,
            accountId: accountId,
            isDebtPayment: true,
            originalDebtId: debt.id,
            originalPaymentId: realPaymentId,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
            owner_type: isLoggedIn ? 'user' : 'guest',
            owner_id: isLoggedIn ? currentUser.id : getGuestId()
        };
        
        console.log('📤 Step 2: Creating transaction with real payment ID...');
        
        let transactionResult;
        if (isLoggedIn) {
            transactionResult = await saveTransactionToBackend(expenseData);
        } else {
            await saveGuestTransaction(expenseData);
            transactionResult = { success: true, id: expenseData.id };
        }
        
        if (!transactionResult || !transactionResult.success) {
            throw new Error('บันทึก transaction ไม่สำเร็จ');
        }
        
        // ✅ 6. อัปเดต payments array ใน memory
        const existingPaymentIndex = payments.findIndex(p => p.id === paymentId);
        if (existingPaymentIndex !== -1) {
            payments[existingPaymentIndex] = {
                ...payments[existingPaymentIndex],
                id: realPaymentId,
                backendId: realPaymentId
            };
        } else {
            payments.push({
                id: realPaymentId,
                debtId: selectedDebtForPayment,
                accountId: accountId,
                amount: amount,
                date: date,
                note: note,
                backendId: realPaymentId,
                createdAt: now.toISOString()
            });
        }
        
        // ✅ 7. บันทึก local storage (ถ้าเปิดใช้งาน)
        if (shouldSaveToLocal) {
            savePaymentsToStorage();
        }
        
        // ✅ 8. โหลดข้อมูลทั้งหมดจาก backend ใหม่ (สำคัญที่สุด!)
        console.log('🔄 Reloading all data from backend...');
        await Promise.all([
            loadTransactionsFromBackend(),  // ✅ โหลด transaction ใหม่
            loadDebtsFromBackend(),          // ✅ โหลด debts ใหม่ (เผื่อยอดเปลี่ยน)
            loadPaymentsFromBackend()        // ✅ โหลด payments ใหม่
        ]);
        
        // ✅ 9. อัปเดต transactions array
        transactions = backendTransactions;
        
        // ✅ 10. รีเฟรช UI ทั้งหมด
        closePaymentModal();
        renderDebtPage();
        updateUI();           // ✅ อัปเดตหน้า overview
        renderCalendar();     // ✅ อัปเดตปฏิทิน
        refreshAnalysisCharts(); // ✅ อัปเดตกราฟ
        
        showToast(`✅ บันทึกการชำระหนี้สำเร็จ (฿${amount.toLocaleString()})`);
        
    } catch (error) {
        console.error('❌ Error in savePayment:', error);
        showToast(`❌ บันทึกไม่สำเร็จ: ${error.message}`);
    }
}

async function saveDebtPaymentToBackend(paymentData) {
    if (!isLoggedIn || !navigator.onLine) {
        // ถ้า offline และบันทึก local ได้
        if (saveToLocalEnabled) {
            // เก็บไว้ในคิวซิงค์
            addToSyncQueue(paymentData, 'create_payment');
            showToast('📦 ออฟไลน์: รอซิงค์อัตโนมัติ', 'info');
            // ส่งกลับ temporary ID
            return { id: paymentData.id, success: true, offline: true };
        }
        return { success: false, error: 'Offline and save to local disabled' };
    }
    
    try {
        console.log('📤 Saving payment to backend:', paymentData);
        
        const response = await fetch(`${API_URL}/debt-payments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUser.id,
                debtId: paymentData.debtId,
                accountId: paymentData.accountId,
                amount: paymentData.amount,
                payment_date: paymentData.date,
                note: paymentData.note || ''
            })
        });
        
        // ✅ อ่าน response body ก่อน
        const result = await response.json();
        
        if (!response.ok) {
            console.error('❌ Backend error response:', result);
            throw new Error(result.error || 'Failed to save payment');
        }
        
        if (result && result.id) {
            console.log('✅ Payment saved to backend, id:', result.id);
            
            // ✅ ส่งกลับ ID จริง
            return {
                success: true,
                id: result.id.toString(),
                message: result.message
            };
        } else {
            throw new Error('No ID returned from backend');
        }
        
    } catch (error) {
        console.error('❌ Error saving payment:', error);
        
        // ถ้า error แต่ saveToLocalEnabled = true ให้เก็บในคิว
        if (saveToLocalEnabled) {
            addToSyncQueue(paymentData, 'create_payment');
            showToast('📦 เกิดข้อผิดพลาด แต่บันทึกไว้ในคิวซิงค์', 'info');
            return { id: paymentData.id, success: true, offline: true, error: error.message };
        }
        
        return {
            success: false,
            error: error.message
        };
    }
}

async function updateDebtPaymentInBackend(paymentData) {
    if (!isLoggedIn || !navigator.onLine) return false;
    
    // ถ้าเป็น temporary ID ให้บันทึกใหม่เลย
    if (paymentData.id.toString().startsWith('payment_')) {
        return saveDebtPaymentToBackend(paymentData);
    }
    
    try {
        console.log('📤 Updating payment in backend:', {
            id: paymentData.id,
            amount: paymentData.amount,
            date: paymentData.date,
            accountId: paymentData.accountId
        });
        
        const response = await fetch(`${API_URL}/debt-payments/${paymentData.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUser.id,
                accountId: paymentData.accountId,
                amount: paymentData.amount,
                payment_date: paymentData.date,
                note: paymentData.note || ''
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Payment updated in backend successfully:', result);
            return true;
        } else {
            const result = await response.json();
            console.error('Failed to update payment:', result);
            return false;
        }
    } catch (error) {
        console.error('Error updating payment:', error);
        return false;
    }
}

async function deleteDebtPaymentFromBackend(paymentId) {
    if (!isLoggedIn || !navigator.onLine) return false;
    
    if (paymentId.toString().startsWith('payment_')) return true;
    
    try {
        const response = await fetch(`${API_URL}/debt-payments/${paymentId}?user_id=${currentUser.id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            console.log('✅ ลบ payment record จาก MySQL สำเร็จ');
            return true;
        } else {
            console.error('Failed to delete payment from backend:', response.status);
            return false;
        }
    } catch (error) {
        console.error('Error deleting payment:', error);
        return false;
    }
}

function switchDebtTab(tab) {
    currentDebtTab = tab; 
    const activeBtn = document.getElementById('debtTabActive');
    const closedBtn = document.getElementById('debtTabClosed');
    
    if (tab === 'active') {
        activeBtn.className = "flex-1 py-3 text-sm font-bold border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400";
        closedBtn.className = "flex-1 py-3 text-sm font-bold border-b-2 border-transparent text-slate-400";
        
        document.getElementById('activeDebtsContainer').classList.remove('hidden');
        document.getElementById('closedDebtsContainer').classList.add('hidden');
        
        renderActiveDebtsList();
    } else {
        activeBtn.className = "flex-1 py-3 text-sm font-bold border-b-2 border-transparent text-slate-400";
        closedBtn.className = "flex-1 py-3 text-sm font-bold border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400";
        
        document.getElementById('activeDebtsContainer').classList.add('hidden');
        document.getElementById('closedDebtsContainer').classList.remove('hidden');
        
        renderClosedDebtsList();
    }
    
    updateDebtSummary();
    renderPaymentHistory();
}

function updateDebtSummary() {
    const currentTab = document.getElementById('debtTabActive').classList.contains('border-indigo-600') ? 'active' : 'closed';
    
    let totalDebt = 0;
    let totalPaid = 0;
    let debtCount = 0;
    
    debts.forEach(debt => {
        if (currentTab === 'active' && debt.status !== 'open') return;
        if (currentTab === 'closed' && debt.status !== 'closed') return;
        
        totalDebt += debt.totalAmount;
        
        const debtPayments = payments.filter(p => p.debtId === debt.id);
        const paidAmount = debtPayments.reduce((sum, p) => sum + p.amount, 0);
        totalPaid += paidAmount;
        debtCount++;
    });
    
     const remaining = totalDebt - totalPaid;
    
    document.getElementById('totalDebtAmount').textContent = `฿${totalDebt.toLocaleString()}`;
    document.getElementById('totalPaidAmount').textContent = `฿${totalPaid.toLocaleString()}`;
    document.getElementById('remainingDebtAmount').textContent = `฿${remaining.toLocaleString()}`;
    document.getElementById('totalDebtCount').textContent = debtCount;
    
    const activeDebtsCount = debts.filter(d => d.status === 'open').length;
    const closedDebtsCount = debts.filter(d => d.status === 'closed').length;
    document.getElementById('activeDebtCount').textContent = activeDebtsCount;
    document.getElementById('closedDebtCount').textContent = closedDebtsCount;
}

function renderActiveDebtsList() {
    const container = document.getElementById('activeDebtsContainer');
    
    if (debts.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8">
                <div class="text-4xl mb-2">💳</div>
                <p class="text-slate-400">ยังไม่มีรายการหนี้</p>
                <button onclick="openAddDebtModal()" class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">
                    + เพิ่มหนี้แรก
                </button>
            </div>
        `;
        return;
    }
    
const activeDebts = debts.filter(d => d.status === 'open');
container.innerHTML = activeDebts.map(debt => {
        const debtPayments = payments.filter(p => p.debtId === debt.id);
        const paidAmount = debtPayments.reduce((sum, p) => sum + p.amount, 0);
        const remainingAmount = debt.totalAmount - paidAmount;
        const progress = (paidAmount / debt.totalAmount) * 100;
        
        const icon = debt.categoryIcon || '📝';
        const categoryLabel = debt.categoryName || 'ไม่ระบุหมวดหมู่';
        const tag = debt.tag ? `<span class="text-[10px] text-indigo-400">${debt.tag}</span>` : '';
        
        return `
        <div class="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 mb-2">
            <div class="flex justify-between items-start mb-3">
                <div class="flex items-center gap-3">
                    <div class="text-2xl">${icon}</div>
                    <div>
                        <p class="font-bold dark:text-white">${debt.name} ${tag}</p>
                        <p class="text-xs text-slate-400">${categoryLabel} • ครบกำหนดวันที่ ${debt.dueDate} ของทุกเดือน</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-bold text-lg text-rose-600">฿${remainingAmount.toLocaleString()}</p>
                    <p class="text-xs text-slate-400">คงเหลือจาก ฿${debt.totalAmount.toLocaleString()}</p>
                </div>
            </div>
            
            <!-- Progress Bar -->
            <div class="mb-3">
                <div class="flex justify-between text-xs mb-1">
                    <span class="text-slate-400">ชำระแล้ว ${progress.toFixed(1)}%</span>
                    <span class="font-bold">฿${paidAmount.toLocaleString()} / ฿${debt.totalAmount.toLocaleString()}</span>
                </div>
                <div class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div class="h-full bg-emerald-500 rounded-full" style="width: ${progress}%"></div>
                </div>
            </div>
            
            <div class="flex justify-between">
                <div class="text-xs text-slate-400">
                    ดอกเบี้ย ${debt.interestRate}% • งวดละ ฿${debt.monthlyPayment.toLocaleString()}
                </div>
<div class="flex gap-2">
    <button onclick="recordPayment('${debt.id}')" 
            class="px-3 py-1 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700">
        ชำระเงิน
    </button>
    <button onclick="openEditDebtModal('${debt.id}')" 
            class="px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-lg hover:bg-blue-200">
        แก้ไข
    </button>
    <button onclick="deleteActiveDebt('${debt.id}')"
            class="px-3 py-1 bg-rose-100 text-rose-600 text-xs rounded-lg hover:bg-rose-200">
        ลบ
    </button>
    <button onclick="closeDebt('${debt.id}')" 
            class="px-3 py-1 bg-purple-100 text-purple-600 text-xs rounded-lg hover:bg-purple-200">
        ปิดหนี้
    </button>
</div>
            </div>
        </div>
        `;
    }).join('');
}

function renderClosedDebtsList() {
    const container = document.getElementById('closedDebtsContainer');
    

 const closedDebts = debts.filter(d => d.status === 'closed');
    
    if (closedDebts.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8">
                <div class="text-4xl mb-2">🎉</div>
                <p class="text-slate-400">ยังไม่มีหนี้ที่ปิด</p>
                <p class="text-xs text-slate-500 mt-1">หนี้ที่ชำระครบแล้วจะแสดงที่นี่</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = closedDebts.map(debt => {
        const debtPayments = payments.filter(p => p.debtId === debt.id);
        const paidAmount = debtPayments.reduce((sum, p) => sum + p.amount, 0);
        const progress = (paidAmount / debt.totalAmount) * 100;
        
        const closedDate = debt.closedAt ? new Date(debt.closedAt).toLocaleDateString('th-TH') : 'ไม่ระบุ';
        
        return `
        <div class="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 mb-2">
            <div class="flex justify-between items-start mb-3">
                <div class="flex items-center gap-3">
                    <div class="text-2xl">${debt.categoryIcon}</div>
                    <div>
                        <p class="font-bold dark:text-white">${debt.name}</p>
                        <p class="text-xs text-slate-400">${debt.categoryName} • ปิดวันที่ ${closedDate}</p>
                        ${debt.closingNote ? `<p class="text-xs text-slate-500 mt-1">📝 ${debt.closingNote}</p>` : ''}
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-bold text-lg text-emerald-600">฿${debt.totalAmount.toLocaleString()}</p>
                    <p class="text-[10px] text-slate-400">ชำระครบ 100%</p>
                </div>
            </div>
            
            <!-- Progress Bar -->
            <div class="mb-3">
                <div class="flex justify-between text-xs mb-1">
                    <span class="text-slate-400">ชำระแล้ว 100%</span>
                    <span class="font-bold">฿${paidAmount.toLocaleString()} / ฿${debt.totalAmount.toLocaleString()}</span>
                </div>
                <div class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div class="h-full bg-emerald-500 rounded-full" style="width: 100%"></div>
                </div>
            </div>
            
            <div class="flex justify-between">
                <div class="text-xs text-slate-400">
                    ดอกเบี้ย ${debt.interestRate}% • ปิดเมื่อ ${closedDate}
                </div>
                <div class="flex gap-2">
                    <button onclick="reopenDebt('${debt.id}')" 
                            class="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-lg hover:bg-blue-100">
                        เปิดหนี้ใหม่
                    </button>
                    <button onclick="deleteClosedDebt('${debt.id}')"  
                            class="px-3 py-1 bg-rose-50 text-rose-600 text-xs rounded-lg hover:bg-rose-100">
                        ลบ
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

function deleteClosedDebt(debtId) {
    const debt = debts.find(d => d.id === debtId);
    if (!debt || debt.status !== 'closed') {
        showToast('❌ ไม่พบรายการหนี้ที่ปิดแล้ว');
        return;
    }
    
    const debtName = debt.name;
    const shouldSaveToLocal = saveToLocalEnabled;
    
    showConfirm(
        'ลบรายการหนี้ที่ปิดแล้ว?',
        `ลบรายการหนี้ "${debtName}" ที่ปิดแล้ว\n⚠️ รายการในหน้าหลักจะเปลี่ยนเป็นรายการทั่วไป (ไม่ใช่รายการผ่อนหนี้)\n\n❌ ลบแล้วไม่สามารถกู้คืนได้!`,
        async () => {
            console.log('🗑️ deleteClosedDebt START - Delete payments, then debt, then update transactions');
            
            // ============================================
            // 0. โหลด transactions ล่าสุด
            // ============================================
            console.log('🔄 Loading latest transactions...');
            if (isLoggedIn && navigator.onLine) {
                await loadTransactionsFromBackend();
                console.log(`✅ Loaded ${transactions.length} transactions from backend`);
            }
            
            // Debug: แสดง transactions ทั้งหมดที่มี originalDebtId
            console.log('🔍 All transactions with originalDebtId:');
            transactions.forEach(t => {
                if (t.originalDebtId) {
                    console.log(`   - id: ${t.id}, originalDebtId: ${t.originalDebtId} (type: ${typeof t.originalDebtId}), isDebtPayment: ${t.isDebtPayment}`);
                }
            });
            
            // หา payments ที่เกี่ยวข้อง
            const relatedPayments = payments.filter(p => p.debtId === debtId);
            
            // ✅ หา transactions ที่เกี่ยวข้อง (แบบครอบคลุมทุกกรณี)
            const debtIdStr = String(debtId);
            const debtIdNum = Number(debtId);
            
            const relatedTransactions = transactions.filter(t => {
                // ตรวจสอบว่าเป็น debt payment
                if (!t.isDebtPayment) return false;
                
                // ตรวจสอบ originalDebtId (รองรับทั้ง string และ number)
                const txDebtId = t.originalDebtId;
                if (txDebtId === null || txDebtId === undefined) return false;
                
                // เปรียบเทียบแบบไม่สนใจชนิด
                return String(txDebtId) === debtIdStr || Number(txDebtId) === debtIdNum;
            });
            
            console.log(`   Found ${relatedPayments.length} payments to delete`);
            console.log(`   Found ${relatedTransactions.length} transactions to update`);
            console.log('   Transaction IDs:', relatedTransactions.map(t => t.id));
            console.log('   Transaction originalDebtIds:', relatedTransactions.map(t => t.originalDebtId));
            
            // ============================================
            // 1. ลบ payments
            // ============================================
            for (const payment of relatedPayments) {
                console.log(`🗑️ Deleting payment: ${payment.id} (${payment.amount} บาท)`);
                
                if (isLoggedIn && navigator.onLine) {
                    await deleteDebtPaymentFromBackend(payment.id);
                    console.log(`   ✅ Payment ${payment.id} deleted from MySQL`);
                } else if (isLoggedIn && !navigator.onLine && shouldSaveToLocal) {
                    addToSyncQueue({ id: payment.id, debtId: debtId }, 'delete_payment');
                    console.log(`   📱 Payment ${payment.id} added to sync queue`);
                }
            }
            
            payments = payments.filter(p => p.debtId !== debtId);
            console.log(`✅ Removed ${relatedPayments.length} payments from payments array`);
            
            // ============================================
            // 2. อัปเดต transactions
            // ============================================
            for (const transaction of relatedTransactions) {
                console.log(`🔄 Updating transaction: ${transaction.id} (isDebtPayment: ${transaction.isDebtPayment} → 0)`);
                
                const updatedTransaction = {
                    ...transaction,
                    isDebtPayment: false,
                    originalDebtId: null,
                    originalPaymentId: null,
                    desc: (transaction.desc || '').replace(' (ผ่อนหนี้)', '').replace('(ผ่อนหนี้)', '').trim(),
                    updatedAt: new Date().toISOString()
                };
                
                console.log(`   New description: "${updatedTransaction.desc}"`);
                
                if (isLoggedIn && navigator.onLine) {
                    await updateTransactionInBackend(updatedTransaction);
                    console.log(`   ✅ Transaction ${transaction.id} updated in MySQL`);
                } else if (isLoggedIn && !navigator.onLine && shouldSaveToLocal) {
                    addToSyncQueue(updatedTransaction, 'update');
                    console.log(`   📱 Transaction ${transaction.id} added to sync queue`);
                }
                
                // อัปเดต local arrays
                const txIndex = transactions.findIndex(t => t.id === transaction.id);
                if (txIndex !== -1) transactions[txIndex] = updatedTransaction;
                
                if (backendTransactions) {
                    const backendIndex = backendTransactions.findIndex(t => t.id === transaction.id);
                    if (backendIndex !== -1) backendTransactions[backendIndex] = updatedTransaction;
                }
                
                if (shouldSaveToLocal) {
                    await financeDB.saveTransaction(updatedTransaction);
                }
            }
            console.log(`✅ Updated ${relatedTransactions.length} transactions (isDebtPayment: 1 → 0)`);
            
            // ============================================
            // 3. ลบ debt
            // ============================================
            if (isLoggedIn && navigator.onLine) {
                console.log('🌐 Deleting debt from MySQL...');
                const success = await deleteDebtFromBackend(debtId);
                if (success) {
                    console.log('✅ Debt deleted from MySQL successfully');
                } else {
                    console.error('❌ Failed to delete debt from MySQL');
                    showToast('⚠️ ลบจาก MySQL ไม่สำเร็จ', 'warning');
                }
            } else if (isLoggedIn && !navigator.onLine && shouldSaveToLocal) {
                console.log('📱 Offline - adding debt deletion to sync queue');
                addToSyncQueue({ id: debtId, type: 'delete_debt' }, 'delete_debt');
                showToast('📦 ออฟไลน์: รอซิงค์อัตโนมัติ', 'info');
            } else if (isLoggedIn && !navigator.onLine && !shouldSaveToLocal) {
                showToast('❌ ไม่สามารถลบได้ (ต้อง online หรือติ๊ก "บันทึกลงเครื่อง")', 'error');
                hideConfirm();
                return;
            }
            
            // ลบ debt จาก local array
            const debtIndex = debts.findIndex(d => d.id === debtId);
            if (debtIndex !== -1) {
                debts.splice(debtIndex, 1);
                console.log('✅ Debt removed from debts array');
            }
            
            // บันทึก localStorage
            if (shouldSaveToLocal) {
                saveDebtsToStorage();
                savePaymentsToStorage();
                console.log('💾 Debts and Payments saved to localStorage');
            }
            
            // รีเฟรช UI
            renderDebtPage();
            updateUI();
            renderCalendar();
            refreshAnalysisCharts();
            
            showToast(`🗑️ ลบหนี้ "${debtName}" สำเร็จ (${relatedTransactions.length} รายการในหน้าหลักเปลี่ยนเป็นรายการทั่วไปแล้ว)`);
            hideConfirm();
        }
    );
}

function deleteActiveDebt(debtId) {
    const debt = debts.find(d => d.id === debtId);
    if (!debt || debt.status !== 'open') {
        showToast('❌ ไม่พบรายการหนี้ที่กำลังผ่อน');
        return;
    }
    
    const debtName = debt.name;
    const shouldSaveToLocal = saveToLocalEnabled;
    
    showConfirm(
        'ลบรายการหนี้?',
        `⚠️ ลบหนี้ "${debtName}" แบบถาวร\n📊 จะลบประวัติการชำระและรายการในหน้าหลักทั้งหมด\n\n❌ ลบแล้วไม่สามารถกู้คืนได้!`,
        async () => {
            console.log('🗑️ deleteActiveDebt START - Delete payments, transactions, then debt');
            
            // ============================================
            // 0. โหลด transactions ล่าสุดก่อน (สำคัญมาก!)
            // ============================================
            console.log('🔄 Loading latest transactions...');
            if (isLoggedIn && navigator.onLine) {
                await loadTransactionsFromBackend();
                console.log(`✅ Loaded ${transactions.length} transactions from backend`);
            }
            
            // Debug: แสดง transactions ทั้งหมดที่มี originalDebtId
            console.log('🔍 All transactions with originalDebtId:');
            transactions.forEach(t => {
                if (t.originalDebtId) {
                    console.log(`   - id: ${t.id}, originalDebtId: ${t.originalDebtId} (type: ${typeof t.originalDebtId}), isDebtPayment: ${t.isDebtPayment}`);
                }
            });
            
            // หา payments และ transactions ที่เกี่ยวข้อง
            const relatedPayments = payments.filter(p => p.debtId === debtId);
            
            // หา transactions แบบครอบคลุม (string และ number)
            const debtIdStr = String(debtId);
            const debtIdNum = Number(debtId);
            
            const relatedTransactions = transactions.filter(t => {
                if (!t.isDebtPayment) return false;
                const txDebtId = t.originalDebtId;
                if (txDebtId === null || txDebtId === undefined) return false;
                return String(txDebtId) === debtIdStr || Number(txDebtId) === debtIdNum;
            });
            
            console.log(`   Found ${relatedPayments.length} payments to delete`);
            console.log(`   Found ${relatedTransactions.length} transactions to delete`);
            console.log('   Transaction IDs:', relatedTransactions.map(t => t.id));
            
            // ============================================
            // 1. ลบ transactions ที่เกี่ยวข้อง (ก่อน)
            // ============================================
            for (const transaction of relatedTransactions) {
                console.log(`🗑️ Deleting transaction: ${transaction.id} (${transaction.amount} บาท)`);
                
                if (isLoggedIn && navigator.onLine) {
                    await deleteTransactionFromBackend(transaction.id);
                    console.log(`   ✅ Transaction ${transaction.id} deleted from MySQL`);
                }
                
                await financeDB.deleteTransaction(transaction.id);
                
                // ลบจาก array
                const txIndex = transactions.findIndex(t => t.id === transaction.id);
                if (txIndex !== -1) transactions.splice(txIndex, 1);
                if (backendTransactions) {
                    const backendIndex = backendTransactions.findIndex(t => t.id === transaction.id);
                    if (backendIndex !== -1) backendTransactions.splice(backendIndex, 1);
                }
            }
            
            // ============================================
            // 2. ลบ payments ที่เกี่ยวข้อง
            // ============================================
            for (const payment of relatedPayments) {
                console.log(`🗑️ Deleting payment: ${payment.id} (${payment.amount} บาท)`);
                
                if (isLoggedIn && navigator.onLine) {
                    await deleteDebtPaymentFromBackend(payment.id);
                    console.log(`   ✅ Payment ${payment.id} deleted from MySQL`);
                } else if (isLoggedIn && !navigator.onLine && shouldSaveToLocal) {
                    addToSyncQueue({ id: payment.id, debtId: debtId }, 'delete_payment');
                    console.log(`   📱 Payment ${payment.id} added to sync queue`);
                }
            }
            
            // ลบ payments จาก array
            payments = payments.filter(p => p.debtId !== debtId);
            console.log(`✅ Removed ${relatedPayments.length} payments from payments array`);
            
            // ============================================
            // 3. ลบ debt
            // ============================================
            if (isLoggedIn && navigator.onLine) {
                console.log('🌐 Deleting debt from MySQL...');
                const success = await deleteDebtFromBackend(debtId);
                if (success) {
                    console.log('✅ Debt deleted from MySQL successfully');
                } else {
                    console.error('❌ Failed to delete debt from MySQL');
                    showToast('⚠️ ลบจาก MySQL ไม่สำเร็จ', 'warning');
                }
            } else if (isLoggedIn && !navigator.onLine && shouldSaveToLocal) {
                console.log('📱 Offline - adding debt deletion to sync queue');
                addToSyncQueue({ id: debtId, type: 'delete_debt' }, 'delete_debt');
                showToast('📦 ออฟไลน์: รอซิงค์อัตโนมัติ', 'info');
            } else if (isLoggedIn && !navigator.onLine && !shouldSaveToLocal) {
                showToast('❌ ไม่สามารถลบได้ (ต้อง online หรือติ๊ก "บันทึกลงเครื่อง")', 'error');
                hideConfirm();
                return;
            }
            
            // ============================================
            // 4. ลบ debt จาก local array
            // ============================================
            const debtIndex = debts.findIndex(d => d.id === debtId);
            if (debtIndex !== -1) {
                debts.splice(debtIndex, 1);
                console.log('✅ Debt removed from debts array');
            }
            
            // ============================================
            // 5. บันทึก localStorage
            // ============================================
            if (shouldSaveToLocal) {
                saveDebtsToStorage();
                savePaymentsToStorage();
                console.log('💾 Debts and Payments saved to localStorage');
            }
            
            // ============================================
            // 6. รีเฟรช UI
            // ============================================
            renderDebtPage();
            updateUI();
            renderCalendar();
            refreshAnalysisCharts();
            
            showToast(`🗑️ ลบหนี้ "${debtName}" และรายการที่เกี่ยวข้องทั้งหมดสำเร็จ`);
            hideConfirm();
        }
    );
}

function renderPaymentHistory() {
    const container = document.getElementById('paymentHistoryContainer');
    
    if (!container) {
        console.warn('⚠️ paymentHistoryContainer not found');
        return;
    }
    
    console.log(`📊 Rendering payment history, payments count: ${payments.length}`);
    
    // ✅ กรองเฉพาะ payments ที่มี debt อยู่ในระบบ
    const sortedPayments = [...payments]
        .filter(p => {
            const debt = debts.find(d => d.id === p.debtId);
            if (!debt) {
                console.log(`⚠️ Payment ${p.id} has no matching debt (debtId: ${p.debtId})`);
                return false;
            }
            return debt.status === 'open';
        })
        .sort((a, b) => {
            const dateA = new Date(a.date || a.createdAt || 0);
            const dateB = new Date(b.date || b.createdAt || 0);
            return dateB - dateA;
        })
        .slice(0, 10);
    
    if (sortedPayments.length === 0) {
        container.innerHTML = '<p class="text-center text-slate-400 text-sm py-4">ยังไม่มีประวัติการชำระ</p>';
        return;
    }
    
    container.innerHTML = sortedPayments.map(payment => {
        const debt = debts.find(d => d.id === payment.debtId);
        const debtName = debt ? debt.name : 'ไม่พบข้อมูล';
        const date = new Date(payment.date);
        const dateStr = date.toLocaleDateString('th-TH');
        
        return `
        <div class="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl group hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
            <div>
                <p class="font-bold text-sm dark:text-white">${debtName}</p>
                <p class="text-xs text-slate-400">${dateStr}</p>
                ${payment.note ? `<p class="text-xs text-slate-500 mt-1">📝 ${payment.note}</p>` : ''}
            </div>
            <div class="flex items-center gap-3">
                <p class="font-bold text-emerald-600">฿${payment.amount.toLocaleString()}</p>
                <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="editPayment('${payment.id}')" 
                            class="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors dark:hover:bg-blue-900/30"
                            title="แก้ไข">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button onclick="deletePayment('${payment.id}')" 
                            class="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors dark:hover:bg-rose-900/30"
                            title="ลบ">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');
}

let editingDebtId = null;
let selectedDebtForPayment = null;

function openAddDebtModal() {
    editingDebtId = null;
    document.getElementById('debtModalTitle').textContent = 'เพิ่มหนี้ใหม่';
    document.getElementById('saveDebtBtn').textContent = 'บันทึก';
    
    const categorySelect = document.getElementById('debtCategorySelect');
    if (categorySelect) {
        categorySelect.innerHTML = `
            <option value="">-- เลือกหมวดหมู่ --</option>
            ${customCategories.spending.map(cat => `
                <option value="${cat.id}">${cat.icon} ${cat.label}</option>
            `).join('')}
        `;
    }
    
    document.getElementById('debtNameInput').value = '';
    document.getElementById('debtTagInput').value = 'ผ่อนหนี้';
    document.getElementById('debtTotalAmount').value = '';
    document.getElementById('debtMonthlyPayment').value = '';
    document.getElementById('debtInterestRate').value = '';
    document.getElementById('debtDueDate').value = '15';
    document.getElementById('debtStartDate').value = new Date().toISOString().split('T')[0];
    
    document.getElementById('debtModal').classList.remove('hidden');
}

function closeDebtModal() {
    document.getElementById('debtModal').classList.add('hidden');
}

function openEditDebtModal(debtId) {
    const debt = debts.find(d => d.id === debtId);
    if (!debt) return;
    
    editingDebtId = debtId;
    document.getElementById('debtModalTitle').textContent = 'แก้ไขหนี้';
    document.getElementById('saveDebtBtn').textContent = 'อัปเดต';
    
    document.getElementById('debtNameInput').value = debt.name;
    document.getElementById('debtCategorySelect').value = debt.categoryId;
    document.getElementById('debtTagInput').value = debt.tag || '#ผ่อนหนี้';
    document.getElementById('debtTotalAmount').value = debt.totalAmount;
    document.getElementById('debtMonthlyPayment').value = debt.monthlyPayment;
    document.getElementById('debtInterestRate').value = debt.interestRate;
    document.getElementById('debtDueDate').value = debt.dueDate;
    document.getElementById('debtStartDate').value = debt.startDate;
    
    document.getElementById('debtModal').classList.remove('hidden');
}

async function saveDebt() {
    const name = document.getElementById('debtNameInput').value.trim();
    const categoryId = document.getElementById('debtCategorySelect').value;
    const tag = document.getElementById('debtTagInput').value.trim();
    const totalAmount = parseFloat(document.getElementById('debtTotalAmount').value);
    const monthlyPayment = parseFloat(document.getElementById('debtMonthlyPayment').value);
    const interestRate = parseFloat(document.getElementById('debtInterestRate').value) || 0;
    const dueDate = parseInt(document.getElementById('debtDueDate').value);
    const startDate = document.getElementById('debtStartDate').value;
    
    if (!name || !categoryId || !totalAmount || !monthlyPayment) {
        showToast('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }
    
    if (dueDate < 1 || dueDate > 31) {
        showToast('กรุณาระบุวันครบกำหนดระหว่าง 1-31');
        return;
    }
    
    const spendingCat = customCategories.spending.find(c => c.id === categoryId);
    if (!spendingCat) {
        showToast('ไม่พบหมวดหมู่ที่เลือก');
        return;
    }
    
    // ✅ ตรวจสอบ saveToLocalEnabled
    const shouldSaveToLocal = saveToLocalEnabled;
    
    const debtData = {
        id: editingDebtId || 'debt_' + Date.now(),
        name,
        categoryId,
        categoryName: spendingCat.label,
        categoryIcon: spendingCat.icon,
        tag: tag || '#ผ่อนหนี้',
        totalAmount,
        monthlyPayment,
        interestRate,
        dueDate,
        startDate,
        status: 'open', 
        closedAt: null,  
        closingNote: '', 
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    if (editingDebtId) {
        // แก้ไขหนี้
        const index = debts.findIndex(d => d.id === editingDebtId);
        if (index !== -1) {
            debts[index] = debtData;
        }
        
        // บันทึก MySQL
        if (isLoggedIn && navigator.onLine) {
            await updateDebtInBackend(debtData);
        } else if (isLoggedIn && !navigator.onLine && shouldSaveToLocal) {
            addToSyncQueue(debtData, 'update_debt');
            showToast('📦 ออฟไลน์: รอซิงค์อัตโนมัติ', 'info');
        }
        
        // ✅ บันทึก local เฉพาะเมื่อ shouldSaveToLocal = true
        if (shouldSaveToLocal) {
            saveDebtsToStorage();
        }
        
    } else {
        // เพิ่มหนี้ใหม่
        debts.push(debtData);
        
        // บันทึก MySQL
        if (isLoggedIn && navigator.onLine) {
            await saveDebtToBackend(debtData);
        } else if (isLoggedIn && !navigator.onLine && shouldSaveToLocal) {
            addToSyncQueue(debtData, 'create_debt');
            showToast('📦 ออฟไลน์: รอซิงค์อัตโนมัติ', 'info');
        }
        
        // ✅ บันทึก local เฉพาะเมื่อ shouldSaveToLocal = true
        if (shouldSaveToLocal) {
            saveDebtsToStorage();
        }
    }
    
    
    closeDebtModal();
    renderDebtPage();
    
    showToast(editingDebtId ? 'อัปเดตข้อมูลหนี้สำเร็จ' : 'เพิ่มหนี้ใหม่สำเร็จ');
}

function recordPayment(debtId) {
    const debt = debts.find(d => d.id === debtId);
    if (!debt) return;
    
    selectedDebtForPayment = debtId;
    editingPaymentId = null;
    
    updatePaymentAccountSelect();

    const saveBtn = document.querySelector('#paymentModal button[onclick="updatePayment"]');
    if (saveBtn) {
        saveBtn.textContent = 'บันทึกการชำระ';
        saveBtn.onclick = savePayment;
    }
    
    const debtPayments = payments.filter(p => p.debtId === debtId);
    const paidAmount = debtPayments.reduce((sum, p) => sum + p.amount, 0);
    const remainingAmount = debt.totalAmount - paidAmount;
    
    document.getElementById('paymentDebtName').innerHTML = `
        ${debt.name}
        <span class="text-xs text-slate-400 block">${debt.categoryName} ${debt.tag ? '• ' + debt.tag : ''}</span>
    `;
    document.getElementById('paymentRemainingAmount').textContent = `฿${remainingAmount.toLocaleString()}`;
    
    window.currentDebtForPayment = debt;
    
    document.getElementById('paymentAmount').value = debt.monthlyPayment;
    document.getElementById('paymentDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('paymentNote').value = '';
    
    document.getElementById('paymentModal').classList.remove('hidden');
}

function updatePaymentAccountSelect() {
    const select = document.getElementById('paymentAccountSelect');
    if (!select) return;
    
    select.innerHTML = accounts.map(acc => `
        <option value="${acc.id}" ${acc.id === currentAccountId ? 'selected' : ''}>
            ${acc.icon} ${acc.name} (฿${getAccountBalance(acc.id).toLocaleString()})
        </option>
    `).join('');
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.add('hidden');
    resetPaymentModal(); 
}


let editingPaymentId = null;

function editPayment(paymentId) {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;
    
    const debt = debts.find(d => d.id === payment.debtId);
    if (!debt) return;
    
    editingPaymentId = paymentId;
    selectedDebtForPayment = payment.debtId;
    window.currentDebtForPayment = debt; 
    
    updatePaymentAccountSelect();

    const debtPayments = payments.filter(p => p.debtId === payment.debtId && p.id !== paymentId);
    const paidAmount = debtPayments.reduce((sum, p) => sum + p.amount, 0);
    const remainingAmount = debt.totalAmount - paidAmount;
    
    document.getElementById('paymentDebtName').innerHTML = `
        ${debt.name}
        <span class="text-xs text-slate-400 block">${debt.categoryName} ${debt.tag ? '• ' + debt.tag : ''}</span>
    `;
    document.getElementById('paymentRemainingAmount').textContent = `฿${remainingAmount.toLocaleString()}`;
    
    const accountSelect = document.getElementById('paymentAccountSelect');
    if (accountSelect && payment.accountId) {
        accountSelect.value = payment.accountId;
    }

    document.getElementById('paymentAmount').value = payment.amount;
    document.getElementById('paymentDate').value = payment.date;
    document.getElementById('paymentNote').value = payment.note || '';
    
    const saveBtn = document.querySelector('#paymentModal button[onclick="savePayment()"]');
    if (saveBtn) {
        saveBtn.textContent = 'อัปเดตการชำระ';
        saveBtn.onclick = updatePayment;
    }
    
    document.getElementById('paymentModal').classList.remove('hidden');
}

async function updatePayment() {
    const accountId = document.getElementById('paymentAccountSelect').value;
    const amount = parseFloat(document.getElementById('paymentAmount').value);
    const date = document.getElementById('paymentDate').value;
    const note = document.getElementById('paymentNote').value.trim();
    
    if (!accountId) {
        showToast('กรุณาเลือกบัญชีที่ใช้ชำระ');
        return;
    }
    
    if (!amount || amount <= 0) {
        showToast('กรุณาระบุจำนวนเงินที่ชำระ');
        return;
    }
    
    if (!editingPaymentId) return;
    
    const shouldSaveToLocal = saveToLocalEnabled;
    
    const paymentIndex = payments.findIndex(p => p.id === editingPaymentId);
    if (paymentIndex === -1) return;
    
    const payment = payments[paymentIndex];
    const debt = debts.find(d => d.id === payment.debtId);
    
    if (!debt) {
        showToast('❌ ไม่พบข้อมูลหนี้');
        return;
    }
    
    // ✅ 1. อัปเดต payment ใน memory
    payments[paymentIndex] = {
        ...payment,
        accountId: accountId,
        amount: amount,
        date: date,
        note: note,
        updatedAt: new Date().toISOString()
    };
    
    // ✅ 2. บันทึก payment ไป MySQL
    if (isLoggedIn && navigator.onLine) {
        const paymentUpdateSuccess = await updateDebtPaymentInBackend(payments[paymentIndex]);
        if (!paymentUpdateSuccess) {
            payments[paymentIndex] = payment;
            showToast('❌ อัปเดตการชำระไม่สำเร็จ');
            return;
        }
    } else if (isLoggedIn && !navigator.onLine && shouldSaveToLocal) {
        addToSyncQueue(payments[paymentIndex], 'update_payment');
        showToast('📦 ออฟไลน์: รอซิงค์อัตโนมัติ', 'info');
    }
    
    if (shouldSaveToLocal) {
        savePaymentsToStorage();
    }
    
    // ✅ 3. ค้นหาและอัปเดต expense transaction ที่เกี่ยวข้อง
    try {
        const expense = transactions.find(t => 
            t.originalPaymentId === editingPaymentId || 
            t.originalPaymentId === editingPaymentId.toString()
        );
        
        if (expense) {
            console.log('🔄 Found related transaction, updating:', expense.id);
            
            const updatedExpense = {
                ...expense,
                accountId: accountId,
                amount: amount,
                date: date,
                rawDate: date,
                desc: debt.name + ' (ผ่อนหนี้)',
                updatedAt: new Date().toISOString(),
                // ✅ สำคัญ: คงค่า isDebtPayment และ originalPaymentId ไว้
                isDebtPayment: true,
                originalPaymentId: editingPaymentId,
                originalDebtId: debt.id
            };
            
            // อัปเดต transaction
            if (isLoggedIn) {
                await updateTransactionInBackend(updatedExpense);
            } else {
                await financeDB.saveTransaction(updatedExpense);
            }
            
            // อัปเดตใน memory
            const expenseIndex = transactions.findIndex(t => t.id === expense.id);
            if (expenseIndex !== -1) {
                transactions[expenseIndex] = updatedExpense;
            }
            if (backendTransactions) {
                const backendIndex = backendTransactions.findIndex(t => t.id === expense.id);
                if (backendIndex !== -1) {
                    backendTransactions[backendIndex] = updatedExpense;
                }
            }
        } else {
            console.warn('⚠️ No related transaction found for payment:', editingPaymentId);
        }
    } catch (error) {
        console.error('❌ Error updating expense transaction:', error);
        showToast('⚠️ อัปเดต payment สำเร็จ แต่ไม่สามารถอัปเดตรายการในหน้าหลักได้');
    }
    
    // ✅ 4. โหลดข้อมูลใหม่ทั้งหมด
    if (isLoggedIn && navigator.onLine) {
        console.log('🔄 Reloading all data after update...');
        await Promise.all([
            loadTransactionsFromBackend(),
            loadDebtsFromBackend(),
            loadPaymentsFromBackend()
        ]);
        transactions = backendTransactions;
    }
    
    // ✅ 5. รีเฟรช UI
    closePaymentModal();
    renderDebtPage();
    updateUI();
    renderCalendar();
    refreshAnalysisCharts();
    
    showToast('✅ อัปเดตการชำระสำเร็จ');
}

function resetPaymentModal() {
    editingPaymentId = null;
    selectedDebtForPayment = null;
    window.currentDebtForPayment = null;
    
    const accountSelect = document.getElementById('paymentAccountSelect');
    if (accountSelect && accounts.length > 0) {
        accountSelect.value = currentAccountId; 
    }
    
    const saveBtn = document.querySelector('#paymentModal button[onclick="updatePayment"]');
    if (saveBtn) {
        saveBtn.textContent = 'บันทึกการชำระ';
        saveBtn.onclick = savePayment;
    }
}

function deletePayment(paymentId) {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;
    
    const debt = debts.find(d => d.id === payment.debtId);
    const debtName = debt ? debt.name : 'หนี้';
    
    showConfirm(
        'ลบรายการชำระหนี้?',
        `ลบการชำระ ${payment.amount.toLocaleString()} บาท ของ "${debtName}"\n` +
        '⚠️ รายการในหน้าหลักจะถูกลบด้วย',
        async () => {
            // ✅ 1. ค้นหา transaction ที่เกี่ยวข้อง
            const expense = transactions.find(t => 
                t.originalPaymentId === paymentId || 
                t.originalPaymentId === paymentId.toString()
            );
            
            // ✅ 2. ลบ transaction (จะลบ payment record ด้วย)
            if (expense) {
                console.log(`🗑️ Deleting related transaction: ${expense.id}`);
                if (isLoggedIn) {
                    await deleteTransaction(expense.id, true);
                } else {
                    await financeDB.deleteTransaction(expense.id);
                }
            } else {
                // ถ้าไม่พบ transaction ให้ลบ payment อย่างเดียว
                if (isLoggedIn && navigator.onLine) {
                    await deleteDebtPaymentFromBackend(paymentId);
                }
                
                payments = payments.filter(p => p.id !== paymentId);
                
                if (saveToLocalEnabled) {
                    savePaymentsToStorage();
                }
            }
            
            // ✅ 3. โหลดข้อมูลใหม่
            if (isLoggedIn && navigator.onLine) {
                await Promise.all([
                    loadTransactionsFromBackend(),
                    loadPaymentsFromBackend()
                ]);
                transactions = backendTransactions;
            }
            
            renderDebtPage();
            updateUI();
            renderCalendar();
            refreshAnalysisCharts();
            
            showToast('✅ ลบรายการชำระสำเร็จ');
            hideConfirm();
        }
    );
}

function deleteDebt(debtId) {
    const debt = debts.find(d => d.id === debtId);
    if (!debt) return;
    
    const debtName = debt.name;
    const isClosedDebt = debt.status === 'closed';
    
    // ✅ ตรวจสอบ saveToLocalEnabled
    const shouldSaveToLocal = saveToLocalEnabled;
    
    if (isClosedDebt) {
        showConfirm(
            'ลบรายการหนี้ที่ปิดแล้ว?',
            `ลบรายการหนี้ "${debtName}" จากรายการที่ปิดแล้ว\n` +
            '⚠️ การชำระเงินและ transaction ที่เกี่ยวข้องจะไม่ถูกลบ',
            () => {
                debts = debts.filter(d => d.id !== debtId);
                
                if (shouldSaveToLocal) {
                    saveDebtsToStorage();
                }
                
                renderDebtPage();
                showToast(`🗑️ ลบรายการหนี้ "${debtName}" จากรายการที่ปิดแล้วสำเร็จ`);
                hideConfirm();
            }
        );
    } else {
        showConfirm(
            'ลบรายการหนี้?', 
            'ลบแล้วจะกู้คืนไม่ได้ รวมถึงประวัติการชำระที่เกี่ยวข้อง', 
            async () => {
                // ลบ MySQL
                if (isLoggedIn && navigator.onLine) {
                    await deleteDebtFromBackend(debtId);
                } else if (isLoggedIn && !navigator.onLine && shouldSaveToLocal) {
                    addToSyncQueue({ id: debtId }, 'delete_debt');
                }
                
                debts = debts.filter(d => d.id !== debtId);
                
                const relatedPayments = payments.filter(p => p.debtId === debtId);
                payments = payments.filter(p => p.debtId !== debtId);
                
                // ลบ expense transactions ที่เกี่ยวข้อง
                if (debt && relatedPayments.length > 0) {
                    try {
                        const relatedExpenses = transactions.filter(t => 
                            t.isDebtPayment && t.originalDebtId === debtId
                        );
                        
                        for (const expense of relatedExpenses) {
                            if (isLoggedIn) {
                                await deleteTransaction(expense.id, true);
                            } else {
                                await financeDB.deleteTransaction(expense.id);
                            }
                        }
                    } catch (error) {
                        console.error('❌ ไม่สามารถลบ expenses ที่เกี่ยวข้อง:', error);
                    }
                }
                
                // ✅ บันทึก local เฉพาะเมื่อ shouldSaveToLocal = true
                if (shouldSaveToLocal) {
                    saveDebtsToStorage();
                    savePaymentsToStorage();
                }
                
                renderDebtPage();
                updateUI();
                refreshAnalysisCharts();
                
                showToast('✅ ลบรายการหนี้และ transaction สำเร็จ');
                hideConfirm();
            }
        );
    }
}

function closeDebt(debtId) {
    const debt = debts.find(d => d.id === debtId);
    if (!debt) return;
    
    const debtPayments = payments.filter(p => p.debtId === debtId);
    const paidAmount = debtPayments.reduce((sum, p) => sum + p.amount, 0);
    const remainingAmount = debt.totalAmount - paidAmount;
    
    if (remainingAmount > 0) {
        showToast(`❌ โปรดชำระหนี้ให้ครบก่อน (เหลืออีก ฿${remainingAmount.toLocaleString()})`);
        return;
    }
    
    const shouldSaveToLocal = saveToLocalEnabled;
    
    showConfirm(
        'ปิดหนี้?', 
        `ยืนยันการปิดหนี้ "${debt.name}"\nชำระครบ ${paidAmount.toLocaleString()} บาท แล้ว`,
        async () => {
            // ตรวจสอบ: ถ้า offline และไม่ติ๊ก checkbox → ไม่สามารถปิดได้
            if (isLoggedIn && !navigator.onLine && !shouldSaveToLocal) {
                showToast('❌ ไม่สามารถปิดหนี้ได้ (ต้อง online เพื่อบันทึกที่ MySQL หรือติ๊ก "บันทึกลงเครื่อง")', 'error');
                hideConfirm();
                return;
            }
            
            // อัปเดตข้อมูล debt
            debt.status = 'closed';
            debt.closedAt = new Date().toISOString().split('T')[0];  // แปลงเป็น YYYY-MM-DD เท่านั้น
            debt.closingNote = `ชำระครบ ${paidAmount.toLocaleString()} บาท`;
            debt.updatedAt = new Date().toISOString();
            
            console.log('📤 Closing debt with data:', {
                id: debt.id,
                name: debt.name,
                status: debt.status,
                closedAt: debt.closedAt,
                totalAmount: debt.totalAmount,
                paidAmount: paidAmount
            });
            
            // บันทึก MySQL (ถ้า online)
            if (isLoggedIn && navigator.onLine) {
                const success = await updateDebtInBackend(debt);
                if (success) {
                    console.log('✅ Debt closed in MySQL successfully');
                } else {
                    console.error('❌ Failed to close debt in MySQL');
                    showToast('⚠️ ปิดหนี้ใน MySQL ไม่สำเร็จ แต่บันทึกในเครื่องแล้ว', 'warning');
                }
            } 
            // ถ้า offline และติ๊ก checkbox → เก็บในคิว
            else if (isLoggedIn && !navigator.onLine && shouldSaveToLocal) {
                addToSyncQueue(debt, 'update_debt');
                showToast('📦 ออฟไลน์: รอซิงค์อัตโนมัติ', 'info');
            }
            
            // บันทึก local เฉพาะเมื่อ shouldSaveToLocal = true
            if (shouldSaveToLocal) {
                saveDebtsToStorage();
                console.log('💾 Debt saved to local storage');
            } else {
                console.log('⏭️ Skip saving debt to local (saveToLocalEnabled = false)');
            }
            
            // รีเฟรช UI
            renderDebtPage();
            updateUI();
            refreshAnalysisCharts();
            
            showToast(`✅ ปิดหนี้ "${debt.name}" สำเร็จ`);
            hideConfirm();
        }
    );
}

function reopenDebt(debtId) {
    const debt = debts.find(d => d.id === debtId);
    if (!debt) return;
    
    const shouldSaveToLocal = saveToLocalEnabled;
    
    showConfirm(
        'เปิดหนี้ใหม่?', 
        `ยืนยันการเปิดหนี้ "${debt.name}" ใหม่\nสามารถติดตามการชำระต่อได้`,
        async () => {
            debt.status = 'open';
            debt.closedAt = null;
            debt.closingNote = '';
            debt.updatedAt = new Date().toISOString();
            
            // บันทึก MySQL
            if (isLoggedIn && navigator.onLine) {
                await updateDebtInBackend(debt);
            } else if (isLoggedIn && !navigator.onLine && shouldSaveToLocal) {
                addToSyncQueue(debt, 'update_debt');
            }
            
            // ✅ บันทึก local เฉพาะเมื่อ shouldSaveToLocal = true
            if (shouldSaveToLocal) {
                saveDebtsToStorage();
            }
            
            renderDebtPage();
            showToast(`📝 เปิดหนี้ "${debt.name}" ใหม่สำเร็จ`);
            hideConfirm();
        }
    );
}

function saveDebtsToStorage() {
    console.log('💾 saveDebtsToStorage called, saveToLocalEnabled =', saveToLocalEnabled);
    console.trace();
    if (saveToLocalEnabled) {
        localStorage.setItem('fin_debts', JSON.stringify(debts));
    } else {
        console.warn('⚠️ ข้ามการบันทึก localStorage เพราะ saveToLocalEnabled = false');
    }
}

function savePaymentsToStorage() {
    // ✅ เพิ่มการตรวจสอบ
    if (!saveToLocalEnabled) {
        console.log('⏭️ savePaymentsToStorage: Skipped (saveToLocalEnabled = false)');
        return;
    }
    
    try {
        localStorage.setItem('fin_debt_payments', JSON.stringify(payments));
        console.log('💾 Payments saved to localStorage');
    } catch (error) {
        console.error('Failed to save payments:', error);
    }
}

function switchPieChartTab(tab) {
    currentPieChartTab = tab;
    
    const catBtn = document.getElementById('pieTabCategories');
    const tagBtn = document.getElementById('pieTabTags');
    
    if (tab === 'categories') {
        catBtn.className = "px-3 py-1 text-xs font-bold rounded-full bg-indigo-600 text-white";
        tagBtn.className = "px-3 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
        
        document.getElementById('pieChartCategoriesContainer').classList.remove('hidden');
        document.getElementById('pieChartTagsContainer').classList.add('hidden');
    } else {
        catBtn.className = "px-3 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
        tagBtn.className = "px-3 py-1 text-xs font-bold rounded-full bg-indigo-600 text-white";
        
        document.getElementById('pieChartCategoriesContainer').classList.add('hidden');
        document.getElementById('pieChartTagsContainer').classList.remove('hidden');
        
        updateTagPieChart();
    }
}

function openYearlyCategoryModal(category, monthIndex, year) {
    console.log(`เปิด modal: ${category} เดือนที่ ${monthIndex + 1} ปี ${year}`);
    
    let icon = '📁';
    let categoryType = 'unknown';
    
    const allCats = [
        ...customCategories.income.map(c => ({...c, type: 'income'})),
        ...customCategories.spending.map(c => ({...c, type: 'spending'})),
        ...customCategories.investment.map(c => ({...c, type: 'investment'}))
    ];
    
    const catInfo = allCats.find(c => c.label === category);
    if (catInfo) {
        icon = catInfo.icon;
        categoryType = catInfo.type;
    } else if (category === 'รวมรายรับ') {
        icon = '💰';
        categoryType = 'income_summary';
    } else if (category === 'รวมรายจ่าย') {
        icon = '💸';
        categoryType = 'expense_summary';
    } else if (category === 'รวมลงทุน') {
        icon = '📈';
        categoryType = 'investment_summary';
    }
    
    const monthKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
    
    let monthTransactions = [];
    
    if (category === 'รวมรายรับ') {
        monthTransactions = transactions.filter(t => 
            t.monthKey === monthKey && 
            t.type === 'income'
        );
    } else if (category === 'รวมรายจ่าย') {
        monthTransactions = transactions.filter(t => 
            t.monthKey === monthKey && 
            t.type === 'expense' &&
            customCategories.spending.some(c => c.label === t.category)
        );
    } else if (category === 'รวมลงทุน') {
        monthTransactions = transactions.filter(t => 
            t.monthKey === monthKey && 
            t.type === 'expense' &&
            customCategories.investment.some(c => c.label === t.category)
        );
    } else if (categoryType === 'income') {
        monthTransactions = transactions.filter(t => 
            t.monthKey === monthKey && 
            t.category === category &&
            t.type === 'income'
        );
    } else {
        monthTransactions = transactions.filter(t => 
            t.monthKey === monthKey && 
            t.category === category &&
            t.type === 'expense'
        );
    }

    if (accountFilterId !== 'all') {
        monthTransactions = monthTransactions.filter(t => 
            t.accountId === accountFilterId || 
            (t.type === 'transfer' && t.transferToAccountId === accountFilterId)
        );
    }
    
    monthTransactions.sort((a, b) => {
        const dateA = new Date(a.rawDate || a.date);
        const dateB = new Date(b.rawDate || b.date);
        return dateB - dateA;
    });
    
    const totalAmount = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    document.getElementById('modalCategoryIcon').textContent = icon;
    document.getElementById('modalCategoryTitle').textContent = `${icon} ${category}`;
    document.getElementById('modalCategoryPeriod').textContent = `${monthNames[monthIndex]} ${year}`;
    document.getElementById('modalTotalAmount').textContent = `฿${totalAmount.toLocaleString()}`;
    document.getElementById('modalTransactionCount').textContent = `${monthTransactions.length} รายการ`;
    
    const listContainer = document.getElementById('yearlyCategoryDetailList');
    
    if (monthTransactions.length === 0) {
        listContainer.innerHTML = `
            <div class="p-8 text-center text-slate-400 italic">
                <div class="text-4xl mb-2">📭</div>
                <p>ไม่มีรายการในเดือนนี้</p>
            </div>
        `;
    } else {
        listContainer.innerHTML = monthTransactions.map(t => {
            const date = new Date(t.rawDate || t.date);
            const dateStr = date.toLocaleDateString('th-TH', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
            });
            
            const tag = t.tag ? `<span class="text-[10px] font-bold text-indigo-400 uppercase ml-2">[${t.tag}]</span>` : '';
            
            const amountClass = t.type === 'income' ? 'text-emerald-500' : 'text-rose-500';
            const prefix = t.type === 'income' ? '+' : '-';
            
            const onClickAction = isMobile() 
                ? `onclick="showMobileActionModal(${JSON.stringify(t).replace(/"/g, '&quot;')})"`
                : '';
            
            return `
            <div ${onClickAction} class="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-600 group hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${isMobile() ? 'cursor-pointer' : ''}">
                <div class="flex items-center gap-3">
                    <div class="text-2xl">${t.icon}</div>
                    <div>
                        <p class="font-bold text-sm dark:text-white">${t.desc}${tag}</p>
                        <p class="text-xs text-slate-400">${dateStr}</p>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <p class="font-bold text-base ${amountClass}">${prefix}฿${t.amount.toLocaleString()}</p>
                    <!-- Desktop buttons -->
                    <div class="flex gap-1 ${isMobile() ? 'hidden' : 'opacity-0 group-hover:opacity-100 transition-opacity'}">
                        <button onclick="editTransaction('${t.id}')" class="p-1 text-indigo-400 hover:text-indigo-600" title="แก้ไข">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button onclick="deleteTransaction('${t.id}')" class="p-1 text-rose-400 hover:text-rose-600" title="ลบ">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            `;
        }).join('');
    }
    
    document.getElementById('yearlyCategoryDetailModal').classList.remove('hidden');
}

function closeYearlyCategoryModal() {
    document.getElementById('yearlyCategoryDetailModal').classList.add('hidden');
}

function updateTagPieChart() {
    console.log('📊 updateTagPieChart() called');
    
    const tagData = getTagAnalysisData();
    
    const container = document.getElementById('tagPieChart')?.parentElement;
    const canvas = document.getElementById('tagPieChart');
    
    if (!container) {
        console.error('❌ ไม่พบ container ของ tagPieChart');
        return;
    }
    
    const hasData = tagData.hasTagData && tagData.topTags.length > 0;
    
    if (!hasData) {
        console.log('⚠️ No data for tagPieChart');
        
        if (canvas) {
            canvas.style.display = 'none';
        }
        
        const existingMessage = container.querySelector('.no-data-message-tagpie');
        if (existingMessage) {
            return;
        }
        
        const message = document.createElement('div');
        message.className = 'no-data-message-tagpie h-64 flex items-center justify-center text-slate-400 text-sm italic';
        message.textContent = 'ไม่มีข้อมูล TAG';
        container.appendChild(message);
        return;
    }
    
    console.log('✅ Has data for tag pie chart');
    
    const noDataMsg = container.querySelector('.no-data-message-tagpie');
    if (noDataMsg) {
        noDataMsg.remove();
    }
    
    if (canvas) {
        canvas.style.display = 'block';
    } else {
        const newCanvas = document.createElement('canvas');
        newCanvas.id = 'tagPieChart';
        container.appendChild(newCanvas);
    }
    
    const ctx = document.getElementById('tagPieChart').getContext('2d');
    
    const topTags = tagData.topTags.slice(0, 8); 
    const labels = topTags.map(t => `#${t.tag}`);
    const amounts = topTags.map(t => t.amount);
    const colors = generateColors(topTags.length);
    
    if (tagPieChart) {
        tagPieChart.data.labels = labels;
        tagPieChart.data.datasets[0].data = amounts;
        tagPieChart.data.datasets[0].backgroundColor = colors;
        tagPieChart.update();
    } else {
        tagPieChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: amounts,
                    backgroundColor: colors,
                    borderWidth: 1,
                    borderColor: '#1e293b'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#ffffff',
                            font: { size: 10 },
                            padding: 10
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const tag = topTags[context.dataIndex];
                                const value = context.raw;
                                const total = tagData.totalTagExpense;
                                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                                return `#${tag.tag}: ฿${value.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}

function switchPage(page) {
    document.getElementById('page-overview').classList.toggle('hidden', page !== 'overview');
    document.getElementById('page-budget').classList.toggle('hidden', page !== 'budget');
    document.getElementById('page-debt').classList.toggle('hidden', page !== 'debt');
    document.getElementById('page-analysis').classList.toggle('hidden', page !== 'analysis');
    document.getElementById('page-yearly').classList.toggle('hidden', page !== 'yearly');
    document.getElementById('page-accounts').classList.toggle('hidden', page !== 'accounts');
    document.getElementById('page-more').classList.toggle('hidden', page !== 'more');
    
    document.getElementById('monthSelector').classList.toggle('hidden', 
        page === 'yearly' || page === 'analysis' || page === 'accounts' || 
        page === 'debt' || page === 'more');
    
    updateAccountFilterDropdown();

    ['overview', 'budget', 'debt', 'analysis', 'yearly', 'accounts', 'more'].forEach(n => {
        const btn = document.getElementById(`nav-${n}`);
        if (btn) {
            if (n === 'more' && !isMobile()) {
                btn.classList.add('hidden');
            } else {
                btn.classList.remove('hidden');
            }
            
            btn.className = page === n ? 
                "px-4 py-2 rounded-lg text-[10px] md:text-xs font-bold transition-all tab-active" : 
                "px-4 py-2 rounded-lg text-[10px] md:text-xs font-bold transition-all text-slate-500 dark:text-slate-400";
        }
    });
    
    updateAllAccountIndicators();
    
    if(page === 'budget') {
        updateBudgetUI(); 
        setTimeout(() => {
            updateCopyBudgetButtonText();
        }, 100);
    } else if (page === 'debt') {
        renderDebtPage();
    } else if(page === 'analysis') {
        updateAnalysisPeriodText();
        refreshAnalysisCharts();
    } else if(page === 'yearly') {
        updateYearlyUI(); 
    } else if(page === 'accounts') {
        renderAccountsList();
        
        console.log("📱 เปิดหน้า accounts, เรียก initTransferForm()");
        
        setTimeout(() => {
            if (document.getElementById('transferFromAccount')) {
                initTransferForm();
            } else {
                console.warn("⚠️ ไม่พบ transferForm ใน DOM, จะลองอีกครั้ง");
                setTimeout(initTransferForm, 500);
            }
        }, 300);
        
    } else if(page === 'more') {
        console.log("📱 เปิดหน้าเพิ่มเติม (Mobile Only)");
    }
    
    updateUI();
    
    if (isMobile()) {
        closeMobileForm();
        window.scrollTo({ top: 0, behavior: 'smooth' });

        document.querySelectorAll('#mobileNav button').forEach(btn => {
            btn.classList.remove('text-indigo-600', 'dark:text-indigo-400');
        });
        
        const activeBtn = document.querySelector(`#mobileNav button[onclick*="switchPage('${page}')"]`);
        if (activeBtn) {
            activeBtn.classList.add('text-indigo-600', 'dark:text-indigo-400');
        }
    }
}




        function getMonthKey() { return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`; }
        function getMonthKeyFromDate(dateStr) {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}
        function updateMonthDisplay() { document.getElementById('currentMonthDisplay').innerText = `${monthFullNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`; }
        
        
        
        function changeMonth(step) { 
            console.log(`changeMonth called with step: ${step}`);
            currentDate.setMonth(currentDate.getMonth() + step); 
            updateMonthDisplay(); 
            updateUI(); 
            renderCalendar();

            if (!document.getElementById('page-budget').classList.contains('hidden')) 
                updateBudgetUI(); 
        }
function goToToday() {
    currentDate = new Date(); 
    updateMonthDisplay(); 
    updateUI(); 
    renderCalendar(); 
    
    document.getElementById('transDate').value = new Date().toISOString().split('T')[0];
    
    showToast("ไปยังวันนี้แล้ว");
}
        function setFontSize(size, notify = true) {
            const sizes = { 'small': '14px', 'medium': '16px', 'large': '18px' };
            document.documentElement.style.setProperty('--base-font-size', sizes[size]);
            currentFontSize = size; localStorage.setItem('fin_fontsize', size);
            ['small', 'medium', 'large'].forEach(s => {
                const btn = document.getElementById(`font-${s}`);
                if (btn) btn.className = s === size ? "py-2 rounded-xl text-xs font-bold transition-all font-btn-active shadow-sm" : "py-2 rounded-xl text-[10px] font-bold transition-all text-slate-400";
            });
            if (notify) showToast(`ตัวอักษร: ${size}`);
        }
        
        function setType(type) {
            currentType = type;
            document.getElementById('btn-income').className = type === 'income' ? 
        "flex-1 py-2 rounded-lg bg-white text-emerald-600 shadow-sm font-bold text-xs transition-all dark:bg-slate-600 dark:text-emerald-400" : 
        "flex-1 py-2 rounded-lg text-slate-500 font-bold text-xs transition-all";
    
    document.getElementById('btn-expense').className = type === 'expense' ? 
        "flex-1 py-2 rounded-lg bg-white text-rose-500 shadow-sm font-bold text-xs transition-all dark:bg-slate-600" : 
        "flex-1 py-2 rounded-lg text-slate-500 font-bold text-xs transition-all";
                updateCategorySelect();
                updateAccountSelect();
        }
        
        function updateCategorySelect() {
            const select = document.getElementById('category'); let html = '';
            if (currentType === 'income') html = customCategories.income.map(cat => `<option value="${cat.label}">${cat.icon} ${cat.label}</option>`).join('');
            else { html += `<option disabled>*** หมวดรายจ่าย</option>`; html += customCategories.spending.map(cat => `<option value="${cat.label}">${cat.icon} ${cat.label}</option>`).join(''); html += `<option disabled>*** หมวดลงทุน</option>`; html += customCategories.investment.map(cat => `<option value="${cat.label}">${cat.icon} ${cat.label}</option>`).join(''); }
            select.innerHTML = html; updateTagSuggestions();
        }
        



function getAccountBalance(accountId) {
    const account = accounts.find(a => a.id === accountId);
    if (!account) return 0;
    
    let baseBalance = account.initialBalance || 0;
    
    console.log(`💰 [DEBUG] คำนวณยอด ${account.name} (${accountId})`);
    console.log(`   initialBalance: ${baseBalance}`);
    
    transactions.forEach(t => {
        if (t.accountId === accountId) {
            console.log(`   transaction: id=${t.id}, type=${t.type}, amount=${t.amount}, isInitialBalance=${t.isInitialBalance}, transferType=${t.transferType}`);
        }
        
        // ข้าม transaction ที่เป็น initial balance
        if (t.isInitialBalance && t.accountId === accountId) {
            console.log(`   ⏭️ ข้าม initial balance transaction: ${t.id}`);
            return;
        }
        
        // รายรับ/รายจ่ายปกติ
        if (t.accountId === accountId) {
            if (t.type === 'income') {
                baseBalance += t.amount;
                console.log(`   +${t.amount} (income)`);
            } else if (t.type === 'expense') {
                baseBalance -= t.amount;
                console.log(`   -${t.amount} (expense)`);
            } else if (t.type === 'transfer') {
                // Transfer ฝั่งต้นทาง (หักเงิน)
                if (t.transferType !== 'internal_receive') {
                    baseBalance -= t.amount;
                    console.log(`   -${t.amount} (transfer out, type=${t.transferType})`);
                }
                // ✅ Transfer ฝั่งรับ (บวกเงิน) - internal_receive
                else if (t.transferType === 'internal_receive') {
                    baseBalance += t.amount;
                    console.log(`   +${t.amount} (transfer in, type=${t.transferType})`);
                }
            }
        }
    });
    
    if (account.manualAdjustment !== undefined) {
        baseBalance += account.manualAdjustment;
        console.log(`   + manual adjustment: ${account.manualAdjustment}`);
    }
    
    console.log(`   = ${baseBalance}`);
    return baseBalance;
}

function validateInitialBalanceTransaction(transactionData, isUpdate = false, oldTransaction = null) {
    // ตรวจสอบว่าเป็น initial balance transaction หรือไม่
    if (!transactionData.isInitialBalance) {
        return { valid: true };
    }
    
    // 1. ตรวจสอบ type ต้องเป็น 'income' เท่านั้น
    if (transactionData.type !== 'income') {
        return { 
            valid: false, 
            error: '⚠️ ไม่สามารถเปลี่ยนประเภทของรายการยอดเริ่มต้นบัญชีได้ (ต้องเป็นรายรับเท่านั้น)' 
        };
    }
    
    // 2. ตรวจสอบ category ต้องเป็น 'อื่นๆ' (หรือหมวดหมู่ที่กำหนด)
    if (transactionData.category !== 'อื่นๆ') {
        return { 
            valid: false, 
            error: '⚠️ ไม่สามารถเปลี่ยนหมวดหมู่ของรายการยอดเริ่มต้นบัญชีได้' 
        };
    }
    
    // 3. ตรวจสอบว่าเป็นกรณีเพิ่มใหม่ (ไม่ใช่แก้ไข) และมี initial balance อยู่แล้วหรือไม่
    if (!isUpdate) {
        const existingInitial = transactions.some(t => 
            t.accountId === transactionData.accountId && 
            t.isInitialBalance === true
        );
        
        if (existingInitial) {
            return { 
                valid: false, 
                error: '⚠️ บัญชีนี้มีรายการยอดเริ่มต้นอยู่แล้ว ไม่สามารถเพิ่มซ้ำได้' 
            };
        }
    }
    
    // 4. กรณีแก้ไข: ตรวจสอบว่าไม่ได้เปลี่ยน accountId
    if (isUpdate && oldTransaction && oldTransaction.accountId !== transactionData.accountId) {
        return { 
            valid: false, 
            error: '⚠️ ไม่สามารถเปลี่ยนบัญชีของรายการยอดเริ่มต้นได้' 
        };
    }
    
    return { valid: true };
}

function updateAccountBalance(accountId) {
    const balance = getAccountBalance(accountId);
    const account = accounts.find(a => a.id === accountId);
    if (account) {
        account.balance = balance;
        account.updatedAt = new Date().toISOString();
    }
    return balance;
}

function calculateTotalBalance() {
    let total = 0;
    accounts.forEach(account => {
        total += getAccountBalance(account.id);
    });
    return total;
}

function getAccountById(accountId) {
    if (!accountId || accountId === 'all') return null;
    

    return accounts.find(a => a.id === accountId);
}

function getDefaultAccount() {
    return accounts.find(a => a.isDefault) || accounts[0];
}

async function setDefaultAccount(accountId) {
    console.log('Setting default account:', accountId);
    
    // อัปเดต local
    accounts.forEach(account => {
        account.isDefault = (account.id === accountId);
        account.updatedAt = new Date().toISOString();
    });
    
    currentAccountId = accountId;
    localStorage.setItem('fin_current_account', accountId);
    
    saveAccounts();
    
    // ✅ อัปเดต MySQL
    if (isLoggedIn && navigator.onLine) {
        for (const account of accounts) {
            await updateAccountInBackend({
                id: account.id,
                name: account.name,
                type: account.type,
                icon: account.icon,
                initialBalance: account.initialBalance,
                isDefault: account.isDefault
            });
        }
    }
    
    renderAccountsList();
    refreshDesktopFormContainer();
    
    if (document.getElementById('transferFromAccount')) {
        updateTransferAccountSelects();
    }
    
    updateAccountFilterDropdown();

    const account = getAccountById(accountId);
    showToast(`✅ ตั้ง "${account.name}" เป็นบัญชีหลักแล้ว`);
}

function refreshDesktopFormContainer() {
    console.log('Refreshing desktop form container...');
    
    updateAccountSelect();
    
    if (!document.getElementById('page-overview').classList.contains('hidden')) {
        console.log('Currently in overview page, refreshing form...');
        
        const formContainer = document.getElementById('formContainer');
        if (formContainer && !formContainer.classList.contains('hidden')) {
            const accountSelect = document.getElementById('accountSelect');
            if (accountSelect) {
                accountSelect.value = currentAccountId;
            }
        }
    }
}

function saveAccounts() {
    localStorage.setItem('fin_accounts', JSON.stringify(accounts));
    
    if (financeDB && financeDB.db) {
        financeDB.saveToIndexedDB('accounts', {
            id: 'user_accounts',
            data: accounts,
            updatedAt: new Date().toISOString()
        });
    }
}


let adjustingAccountId = null;

function openAdjustBalanceModal(accountId) {
    const account = getAccountById(accountId);
    if (!account) return;
    
    adjustingAccountId = accountId;
    
    document.getElementById('adjustAccountIcon').textContent = account.icon || '🏦';
    document.getElementById('adjustAccountName').textContent = account.name;
    
    const currentBalance = getAccountBalance(accountId);
    document.getElementById('adjustCurrentBalance').textContent = `฿${currentBalance.toLocaleString()}`;
    
    document.getElementById('adjustNewBalance').value = '';
    
    document.getElementById('adjustBalanceModal').classList.remove('hidden');
}

function closeAdjustBalanceModal() {
    document.getElementById('adjustBalanceModal').classList.add('hidden');
    adjustingAccountId = null;
}

function confirmAdjustBalance() {
    if (!adjustingAccountId) {
        showToast('⚠️ ไม่พบข้อมูลบัญชี');
        return;
    }
    
    const account = getAccountById(adjustingAccountId);
    if (!account) {
        showToast('⚠️ ไม่พบข้อมูลบัญชี');
        return;
    }
    
    const newBalanceInput = document.getElementById('adjustNewBalance');
    const newBalance = parseFloat(newBalanceInput.value);
    
    if (newBalanceInput.value.trim() === '') {
        showToast('⚠️ กรุณาพิมพ์ยอดคงเหลือที่ต้องการ');
        newBalanceInput.focus();
        return;
    }
    
    if (isNaN(newBalance)) {
        showToast('⚠️ กรุณาพิมพ์ตัวเลขเท่านั้น');
        newBalanceInput.value = '';
        newBalanceInput.focus();
        return;
    }
    
    if (newBalance < 0) {
        showToast('⚠️ ยอดคงเหลือต้องไม่ติดลบ');
        newBalanceInput.value = '';
        newBalanceInput.focus();
        return;
    }
    
    // ✅ แก้ไข: ใช้ adjustingAccountId แทน targetAccountId
    let baseTransactionBalance = account.initialBalance || 0;
    transactions.forEach(t => {
        // ✅ ใช้ adjustingAccountId แทน targetAccountId
        if (t.accountId === adjustingAccountId) {
            if (t.type === 'income') baseTransactionBalance += t.amount;
            else if (t.type === 'expense') baseTransactionBalance -= t.amount;
            else if (t.type === 'transfer') baseTransactionBalance -= t.amount;
        }
        if (t.type === 'transfer' && t.transferToAccountId === adjustingAccountId) {
            if (t.transferType !== 'as_income') baseTransactionBalance += t.amount;
        }
    });
    
    const currentBalance = baseTransactionBalance + (account.manualAdjustment || 0);
    
    if (Math.abs(newBalance - currentBalance) < 0.01) {
        showToast('ℹ️ ยอดคงเหลือเท่าเดิม');
        closeAdjustBalanceModal();
        return;
    }
    
    const newManualAdjustment = newBalance - baseTransactionBalance;
    
    if (confirm(`ปรับยอดจาก ฿${currentBalance.toLocaleString()} เป็น ฿${newBalance.toLocaleString()}?`)) {
        account.manualAdjustment = newManualAdjustment;
        account.lastAdjustment = new Date().toISOString();
        account.updatedAt = new Date().toISOString();
        
        if (!account.balanceAdjustments) {
            account.balanceAdjustments = [];
        }
        account.balanceAdjustments.push({
            date: new Date().toISOString(),
            oldBalance: currentBalance,
            newBalance: newBalance,
            baseBalance: baseTransactionBalance,
            adjustment: newManualAdjustment
        });
        
        saveAccounts();
        
        renderAccountsList();
        
        closeAdjustBalanceModal();
        
        showToast(`✅ ปรับยอด ${account.name} สำเร็จ: ฿${newBalance.toLocaleString()}`);
    }
}



function renderAccountsList() {
    const container = document.getElementById('accountsListContainer');
    if (!container) return;
    
    document.getElementById('totalAccountsCount').textContent = accounts.length;
    document.getElementById('totalBalanceAll').textContent = `฿${calculateTotalBalance().toLocaleString()}`;
    
    if (accounts.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8">
                <div class="text-4xl mb-2">🏦</div>
                <p class="text-slate-400">ยังไม่มีบัญชี</p>
                <button onclick="openAddAccountModal()" class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">
                    + เพิ่มบัญชีแรก
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = accounts.map(account => {
        const balance = getAccountBalance(account.id);
        const balanceClass = balance >= 0 ? 'text-emerald-600' : 'text-rose-600';
        const isDefault = account.isDefault ? 'บัญชีหลัก' : '';
        
        const hasAdjustment = account.adjustedBalance !== undefined ? 
            '<span class="ml-1 text-[8px] bg-indigo-100 text-indigo-600 px-1 rounded">ปรับแล้ว</span>' : '';
        
        return `
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-7  00">
            <div class="flex justify-between items-start mb-2">
                <div class="flex items-center gap-3">
                    <div class="text-2xl">${account.icon}</div>
                    <div>
                        <p class="font-bold dark:text-white">${account.name} ${hasAdjustment}</p>
                        <p class="text-xs text-slate-400">${account.type} • ${isDefault}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-bold text-lg ${balanceClass}">฿${Math.abs(balance).toLocaleString()}</p>
                    <p class="text-[10px] text-slate-400">
                        ${balance >= 0 ? 'ยอดคงเหลือ' : 'ยอดติดลบ'}
                    </p>
                </div>
            </div>
            
            <div class="flex justify-between mt-3">
                <button onclick="setDefaultAccount('${account.id}')" 
                        class="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg hover:bg-slate-200 ${account.isDefault ? 'bg-indigo-100 text-indigo-600' : ''}">
                    ${account.isDefault ? '✅ หลักแล้ว' : 'ตั้งเป็นหลัก'}
                </button>
                 <!-- ⭐⭐ ปุ่ม 3 ปุ่ม: ปรับยอด/แก้ไข/ลบ ⭐⭐ -->
                <div class="flex gap-1">
                    <!-- ปุ่มปรับยอด (ใหม่) -->
                    <button onclick="openAdjustBalanceModal('${account.id}')" 
                            class="px-3 py-1 bg-amber-50 text-amber-600 text-xs rounded-lg hover:bg-amber-100 flex items-center gap-1"
                            title="ปรับยอดคงเหลือ">
                        <span>⚖️</span>
                        <span>ปรับยอด</span>
                    </button>
                    
                    <!-- ปุ่มแก้ไข -->
                    <button onclick="editAccount('${account.id}')" 
                            class="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-lg hover:bg-blue-100 flex items-center gap-1">
                        <span>✎</span>
                        <span>แก้ไข</span>
                    </button>
                    
                    <!-- ปุ่มลบ -->
                    <button onclick="deleteAccount('${account.id}')" 
                            class="px-3 py-1 bg-rose-50 text-rose-600 text-xs rounded-lg hover:bg-rose-100 flex items-center gap-1"
                            ${account.isDefault ? 'disabled' : ''}>
                        <span>🗑️</span>
                        <span>ลบ</span>
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');
}


let editingAccountId = null;
let selectedAccountIcon = '🏦';

function openAddAccountModal() {
    editingAccountId = null;
    document.getElementById('accountModalTitle').textContent = 'เพิ่มบัญชีใหม่';
    document.getElementById('saveAccountBtn').textContent = 'บันทึก';
    document.getElementById('accountNameInput').value = '';
    document.getElementById('accountTypeSelect').value = 'savings';
    document.getElementById('accountInitialBalance').value = '';
    document.getElementById('isDefaultAccount').checked = false;
    selectedAccountIcon = '🏦';
    document.getElementById('selectedAccountIcon').textContent = '🏦';
    
    
    document.getElementById('accountModal').classList.remove('hidden');
}

function openEditAccountModal(accountId) {
    const account = getAccountById(accountId);
    if (!account) return;
    
    editingAccountId = accountId;
    document.getElementById('accountModalTitle').textContent = 'แก้ไขบัญชี';
    document.getElementById('saveAccountBtn').textContent = 'อัปเดต';
    document.getElementById('accountNameInput').value = account.name;
    document.getElementById('accountTypeSelect').value = account.type;
    document.getElementById('accountInitialBalance').value = account.initialBalance || 0;
    document.getElementById('isDefaultAccount').checked = account.isDefault || false;
    selectedAccountIcon = account.icon || '🏦';
    document.getElementById('selectedAccountIcon').textContent = selectedAccountIcon;
    
    
    document.getElementById('accountModal').classList.remove('hidden');
}


function applyBalanceAdjustment() {
    if (!editingAccountId) return;
    
    const account = getAccountById(editingAccountId);
    if (!account) return;
    
    const adjustType = document.getElementById('adjustBalanceType').value;
    const adjustAmount = parseFloat(document.getElementById('adjustBalanceAmount').value);
    
    if (isNaN(adjustAmount) || adjustAmount <= 0) {
        showToast('กรุณาระบุจำนวนเงินที่ถูกต้อง');
        return;
    }
    
    const currentBalance = getAccountBalance(account.id);
    let newBalance = currentBalance;
    
    switch(adjustType) {
        case 'set':
            newBalance = adjustAmount;
            break;
        case 'add':
            newBalance = currentBalance + adjustAmount;
            break;
        case 'subtract':
            newBalance = currentBalance - adjustAmount;
            break;
    }
    
    const now = new Date();
    const adjustmentTransaction = {
        id: `balance_adjust_${Date.now()}`,
        amount: Math.abs(newBalance - currentBalance),
        type: newBalance > currentBalance ? 'income' : 'expense',
        category: 'ปรับยอดคงเหลือ',
        icon: '⚖️',
        desc: `ปรับยอดคงเหลือบัญชี ${account.name}`,
        tag: '#ปรับยอด',
        rawDate: now.toISOString().split('T')[0],
        monthKey: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
        date: now.toISOString().split('T')[0],
        accountId: account.id,
        isBalanceAdjustment: true, 
        originalBalance: currentBalance,
        newBalance: newBalance,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
    };
    
    showConfirm(
        'ยืนยันการปรับยอดคงเหลือ?',
        `จาก ฿${currentBalance.toLocaleString()} → ฿${newBalance.toLocaleString()}\n\n` +
        '⚠️ การปรับยอดนี้จะถูกบันทึกเป็น transaction และไม่กระทบกับประวัติเดิม',
        async () => {
            try {
                const result = await financeDB.saveTransaction(adjustmentTransaction);
                
                if (result.success) {
                    const exists = transactions.some(t => t.id === adjustmentTransaction.id);
                    if (!exists) {
                        transactions.unshift(adjustmentTransaction);
                    }
                    
                    const newBalance = getAccountBalance(account.id);
                    document.getElementById('currentBalanceDisplay').textContent = `฿${newBalance.toLocaleString()}`;
                    
                    document.getElementById('adjustBalanceAmount').value = '';
                    
                    if (!document.getElementById('page-accounts').classList.contains('hidden')) {
                        renderAccountsList();
                    }
                    
                    updateAccountSelect();
                    updateAccountFilterDropdown();
                    
                    showToast(`✅ ปรับยอดคงเหลือสำเร็จ: ฿${newBalance.toLocaleString()}`);
                    hideConfirm();
                } else {
                    showToast('❌ ปรับยอดไม่สำเร็จ');
                    hideConfirm();
                }
            } catch (error) {
                console.error('Error adjusting balance:', error);
                showToast('❌ เกิดข้อผิดพลาด: ' + error.message);
                hideConfirm();
            }
        }
    );
}


function closeAccountModal() {
    document.getElementById('accountModal').classList.add('hidden');
    editingAccountId = null;
    
}

function selectAccountIcon(icon) {
    selectedAccountIcon = icon;
    document.getElementById('selectedAccountIcon').textContent = icon;
}

async function saveAccount() {
    const name = document.getElementById('accountNameInput').value.trim();
    if (!name) {
        showToast('กรุณาระบุชื่อบัญชี');
        return;
    }
    
    const type = document.getElementById('accountTypeSelect').value;
    const initialBalance = parseFloat(document.getElementById('accountInitialBalance').value) || 0;
    const isDefault = document.getElementById('isDefaultAccount').checked;
    
    if (editingAccountId) {
        // แก้ไขบัญชี
        const account = getAccountById(editingAccountId);
        if (!account) {
            showToast('ไม่พบข้อมูลบัญชี');
            return;
        }
        
        const oldInitialBalance = account.initialBalance || 0;
        const isChangingInitialBalance = (initialBalance !== oldInitialBalance);
        
        if (isChangingInitialBalance) {
            // ✅ ตรวจสอบว่ามี transaction ใดๆ ของบัญชีนี้หรือไม่ (รวม initial balance)
            const hasAnyTransaction = transactions.some(t => 
                t.accountId === editingAccountId
            );
            
            if (hasAnyTransaction) {
                showToast('⚠️ ไม่สามารถแก้ไขยอดเริ่มต้นผ่านหน้าแก้ไขบัญชีได้ เนื่องจากมีรายการในบัญชีนี้แล้ว (ให้แก้ไขผ่านหน้า history แทน)', 'error');
                document.getElementById('accountInitialBalance').value = oldInitialBalance;
                return;
            }
            
            // ✅ ถ้าไม่มี transaction เลย (บัญชีใหม่ที่ยังไม่มีข้อมูล) ให้สร้าง transaction ใหม่
            if (initialBalance > 0) {
                const now = new Date();
                const newTransaction = {
                    id: `initial_${account.id}_${Date.now()}`,
                    amount: initialBalance,
                    type: 'income',
                    category: 'อื่นๆ',
                    icon: '💰',
                    desc: `ยอดเริ่มต้นบัญชี ${name}`,
                    tag: '#เปิดบัญชี',
                    rawDate: now.toISOString().split('T')[0],
                    monthKey: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
                    date: now.toISOString().split('T')[0],
                    accountId: account.id,
                    isInitialBalance: true,
                    createdAt: now.toISOString(),
                    updatedAt: now.toISOString(),
                    owner_type: isLoggedIn ? 'user' : 'guest',
                    owner_id: isLoggedIn ? currentUser.id : getGuestId()
                };
                
                // บันทึก transaction
                if (isLoggedIn) {
                    await saveLoggedInTransaction(newTransaction);
                } else {
                    await saveGuestTransaction(newTransaction);
                }
            }
        }
        
        // อัปเดตข้อมูลบัญชี
        account.name = name;
        account.type = type;
        account.icon = selectedAccountIcon;
        account.initialBalance = initialBalance;
        account.updatedAt = new Date().toISOString();

        if (isLoggedIn && navigator.onLine) {
            await updateAccountInBackend(account);
        }
        
        if (isDefault) {
            setDefaultAccount(account.id);
        } else if (account.isDefault && !isDefault) {
            const otherAccount = accounts.find(a => a.id !== account.id);
            if (otherAccount) {
                setDefaultAccount(otherAccount.id);
            }
        }
        
        saveAccounts();
        renderAccountsList();
        closeAccountModal();
        updateAccountSelect();
        updateAccountFilterDropdown();
        
        showToast('อัปเดตบัญชีสำเร็จ');
        
    } else {
        // เพิ่มบัญชีใหม่
        const newAccount = {
            id: 'acc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            name,
            type,
            icon: selectedAccountIcon,
            color: getRandomAccountColor(),
            initialBalance: initialBalance,
            isDefault: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        accounts.push(newAccount);

        // บันทึกบัญชีไป MySQL (ถ้า login และออนไลน์)
        if (isLoggedIn && navigator.onLine) {
            await saveAccountToBackend(newAccount);
        }
        
        // บันทึก initial transaction (ถ้ามียอดเริ่มต้น)
        if (initialBalance > 0) {
            const now = new Date();
            const initialTransaction = {
                id: `initial_${newAccount.id}`,
                amount: initialBalance,
                type: 'income',
                category: 'อื่นๆ',
                icon: '💰',
                desc: `ยอดเริ่มต้นบัญชี ${name}`,
                tag: '#เปิดบัญชี',
                rawDate: now.toISOString().split('T')[0],
                monthKey: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
                date: now.toISOString().split('T')[0],
                accountId: newAccount.id,
                isInitialBalance: true,
                createdAt: now.toISOString(),
                updatedAt: now.toISOString(),
                owner_type: isLoggedIn ? 'user' : 'guest',
                owner_id: isLoggedIn ? currentUser.id : getGuestId()
            };
            
            if (isLoggedIn) {
                await saveLoggedInTransaction(initialTransaction);
            } else {
                await saveGuestTransaction(initialTransaction);
            }
        }
        
        // ตั้งค่าเป็นบัญชีหลัก
        if (isDefault) {
            setDefaultAccount(newAccount.id);
        } else if (accounts.length === 1) {
            setDefaultAccount(newAccount.id);
        }
        
        saveAccounts();
        renderAccountsList();
        closeAccountModal();
        updateAccountSelect();
        updateAccountFilterDropdown();
        
        showToast('✅ เพิ่มบัญชีสำเร็จ');
    }
}

async function updateAccountInBackend(accountData) {
    if (!isLoggedIn || !navigator.onLine) return false;
    
    try {
         const response = await fetch(`${API_URL}/accounts/${accountData.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUser.id,
                name: accountData.name,
                type: accountData.type,
                icon: accountData.icon,
                initialBalance: accountData.initialBalance || 0,
                isDefault: accountData.isDefault || false
            })
        });
        
        if (!response.ok) {
            throw new Error('อัปเดตไม่สำเร็จ');
        }
        
        console.log('✅ อัปเดต account ใน MySQL สำเร็จ');
        return true;
        
    } catch (error) {
        console.error('Error updating account:', error);
        return false;
    }
}

function editAccount(accountId) {
    openEditAccountModal(accountId);
}

function deleteAccount(accountId) {
    console.log('🗑️ deleteAccount called with id:', accountId);
    
    const account = getAccountById(accountId);
    if (!account) {
        console.log('❌ Account not found');
        return;
    }
    
    if (account.isDefault) {
        showToast('ไม่สามารถลบบัญชีหลักได้');
        return;
    }
    
    // ✅ นับจำนวน transaction ที่เกี่ยวข้อง
    const hasTransactions = transactions.some(t => 
        t.accountId === accountId || t.transferToAccountId === accountId
    );
    
    // ✅ นับจำนวน transaction ที่แน่นอน
    const transactionCount = transactions.filter(t => 
        t.accountId === accountId || t.transferToAccountId === accountId
    ).length;
    
    if (hasTransactions) {
        // ✅ แจ้งเตือนว่ามี transaction กี่รายการที่จะถูกลบ
        showConfirm(
            '⚠️ ลบบัญชีและรายการทั้งหมด?', 
            `บัญชี "${account.name}" มีรายการที่เกี่ยวข้อง ${transactionCount} รายการ\n\n` +
            `⚠️ คำเตือน: Transaction ทั้งหมด ${transactionCount} รายการจะถูกลบถาวร\n` +
            `📌 รวมถึงรายการรับ-จ่าย และรายการโอนเงินที่เกี่ยวข้อง\n\n` +
            `❌ ไม่สามารถกู้คืนได้!`, 
            async () => {
                await performDeleteAccount(accountId);
            }
        );
    } else {
        // ✅ ถ้าไม่มี transaction ก็ลบเฉยๆ
        performDeleteAccount(accountId);
    }
}

// ✅ สร้างฟังก์ชันใหม่สำหรับการลบ (แยก logic)
async function performDeleteAccount(accountId) {
    try {
        const account = getAccountById(accountId);
        const accountName = account ? account.name : accountId;
        
        console.log('🗑️ กำลังลบบัญชีและรายการทั้งหมด:', accountId, accountName);
        
        // ✅ นับ transaction ก่อนลบ (สำหรับแสดงผล)
        const transactionCount = transactions.filter(t => 
            t.accountId === accountId || t.transferToAccountId === accountId
        ).length;
        
        // 1. ลบจาก MySQL (พร้อม transactions ที่เกี่ยวข้อง)
        if (isLoggedIn && navigator.onLine) {
            console.log('📡 Sending DELETE to MySQL...');
            const response = await fetch(`${API_URL}/accounts/${accountId}?user_id=${currentUser.id}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            console.log('📡 Response:', result);
            
            if (!response.ok) {
                throw new Error(result.error || 'ลบจาก MySQL ไม่สำเร็จ');
            }
            
            console.log(`✅ ลบจาก MySQL สำเร็จ: ลบ account และ ${result.deleted_transactions || transactionCount} transactions`);
        } else if (isLoggedIn && !navigator.onLine) {
            // ถ้า offline ให้ใส่คิวรอซิงค์
            addToSyncQueue({ id: accountId, type: 'delete_account' }, 'delete_account');
            showToast('📦 ออฟไลน์: จะลบเมื่อกลับมาออนไลน์', 'info');
        }
        
        // 2. ลบจาก local (accounts array)
        accounts = accounts.filter(a => a.id !== accountId);
        saveAccounts();
        
        // 3. ลบ transactions ที่เกี่ยวข้องจาก local
        const beforeTxCount = transactions.length;
        transactions = transactions.filter(t => 
            t.accountId !== accountId && t.transferToAccountId !== accountId
        );
        const deletedTxCount = beforeTxCount - transactions.length;
        console.log(`✅ ลบ transactions ในเครื่อง ${deletedTxCount} รายการ`);
        
        // 4. ลบจาก IndexedDB
        if (financeDB && financeDB.db) {
            try {
                // ลบ account จาก IndexedDB
                const transaction = financeDB.db.transaction(['accounts'], 'readwrite');
                const store = transaction.objectStore('accounts');
                await new Promise((resolve, reject) => {
                    const request = store.delete('user_accounts');
                    request.onsuccess = () => resolve();
                    request.onerror = () => reject(request.error);
                });
                
                // ลบ transactions ที่เกี่ยวข้องจาก IndexedDB
                const allTx = await financeDB.getAllTransactions();
                for (const tx of allTx) {
                    if (tx.accountId === accountId || tx.transferToAccountId === accountId) {
                        await financeDB.deleteTransaction(tx.id);
                    }
                }
                
                console.log('✅ ลบจาก IndexedDB สำเร็จ');
            } catch (dbError) {
                console.warn('⚠️ ลบ IndexedDB ไม่สำเร็จ:', dbError);
            }
        }
        
        // 5. อัปเดต UI
        renderAccountsList();
        updateAccountSelect();
        updateAccountFilterDropdown();
        updateUI();
        renderCalendar();
        refreshAnalysisCharts();
        
        // 6. เปลี่ยน currentAccountId ถ้าจำเป็น
        if (currentAccountId === accountId && accounts.length > 0) {
            const newDefault = accounts.find(a => a.isDefault) || accounts[0];
            if (newDefault) {
                setDefaultAccount(newDefault.id);
            }
        }
        
        showToast(`✅ ลบบัญชี "${accountName}" และ ${deletedTxCount} รายการที่เกี่ยวข้อง สำเร็จ`);
        
    } catch (error) {
        console.error('❌ Error deleting account:', error);
        showToast(`❌ ${error.message}`);
    }
}


function getRandomAccountColor() {
    const colors = [
        '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
        '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#14b8a6'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}


function updateAccountSelect() {
    const desktopSelect = document.getElementById('accountSelect');
    if (desktopSelect) {
        desktopSelect.innerHTML = accounts.map(acc => `
            <option value="${acc.id}" ${acc.id === currentAccountId ? 'selected' : ''}>
                ${acc.icon} ${acc.name}
            </option>
        `).join('');
        
        // ✅ ไม่ต้องแปลงเป็น parseInt
        if (!desktopSelect.value || !accounts.some(a => a.id === desktopSelect.value)) {
            desktopSelect.value = currentAccountId;
        }
    }
}

function updateAccountFilterDropdown() {
    const dropdownIds = [
        'accountFilterSelect',
        'budgetAccountFilterMobile',
        'budgetAccountFilterDesktop',
        'analysisAccountFilterMobile',
        'analysisAccountFilterDesktop',
        'yearlyAccountFilterMobile',
        'yearlyAccountFilterDesktop'
    ];
    
    const optionsHTML = `
        <option value="all">📊 ทุกบัญชี</option>
        ${accounts.map(acc => `
            <option value="${acc.id}">
                ${acc.icon} ${acc.name}
            </option>
        `).join('')}
    `;
    
    dropdownIds.forEach(id => {
        const select = document.getElementById(id);
        if (select) {
            const currentValue = accountFilterId === 'all' ? 'all' : accountFilterId;
            select.innerHTML = optionsHTML;
            select.value = currentValue;
            
            select.removeEventListener('change', applyAccountFilter);
            select.addEventListener('change', applyAccountFilter);
        }
    });
}

function applyAccountFilter() {
    const eventSource = event.target;
    const newValue = eventSource.value;
    
    accountFilterId = newValue;
    
    const dropdownIds = [
        'accountFilterSelect',
        'budgetAccountFilterMobile',
        'budgetAccountFilterDesktop',
        'analysisAccountFilterMobile',
        'analysisAccountFilterDesktop',
        'yearlyAccountFilterMobile',
        'yearlyAccountFilterDesktop'
    ];
    
    dropdownIds.forEach(id => {
        const select = document.getElementById(id);
        if (select && select.id !== eventSource.id) { 
            select.value = accountFilterId;
        }
    });
    
    updateAllAccountIndicators();
    
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'overview':
            updateUI();
            const isCalendarTabActive = !document.getElementById('overview-calendar-content').classList.contains('hidden');
            if (isCalendarTabActive) {
                renderCalendar();
            }
            break;
        case 'budget':
            updateBudgetUI();
            break;
        case 'analysis':
            refreshAnalysisCharts();
            break;
        case 'yearly':
            updateYearlyUI();
            if (document.getElementById('y-tab-tags').classList.contains('active')) {
                updateYearlyTagsUI();
            }
            break;
    }
    
    localStorage.setItem('fin_account_filter', accountFilterId);
    
    console.log(`✅ Applied account filter: ${accountFilterId} (synced all pages)`);
}

function updateCalendarAccountIndicator() {
    const indicator = document.getElementById('calendarAccountIndicator');
    if (!indicator) return;
    
    const isCalendarTabActive = !document.getElementById('overview-calendar-content').classList.contains('hidden');
    
    if (isCalendarTabActive && accountFilterId !== 'all') {
        const account = getAccountById(accountFilterId);
        if (account) {
            indicator.innerHTML = `📁 ${account.name}`;
            indicator.classList.remove('hidden');
        }
    } else {
        indicator.classList.add('hidden');
    }
}

function updateAllAccountIndicators() {
    updateCalendarAccountIndicator();
    
    const budgetIndicator = document.getElementById('budgetAccountIndicator');
    if (budgetIndicator) {
        if (accountFilterId !== 'all') {
            const account = getAccountById(accountFilterId);
            budgetIndicator.innerHTML = `📁 ${account?.name || 'Unknown'}`;
        } else {
            budgetIndicator.innerHTML = '';
        }
    }
    
    const analysisIndicator = document.getElementById('analysisAccountIndicator');
    if (analysisIndicator) {
        if (accountFilterId !== 'all') {
            const account = getAccountById(accountFilterId);
            analysisIndicator.innerHTML = `📁 กำลังวิเคราะห์: ${account?.name || 'Unknown'}`;
        } else {
            analysisIndicator.innerHTML = '';
        }
    }
    
    const yearlyIndicator = document.getElementById('yearlyAccountIndicator');
    if (yearlyIndicator) {
        if (accountFilterId !== 'all') {
            const account = getAccountById(accountFilterId);
            yearlyIndicator.innerHTML = `📁 ${account?.name || 'Unknown'}`;
        } else {
            yearlyIndicator.innerHTML = '';
        }
    }
}

function setBudgetMode(mode) {
    budgetMode = mode;
    localStorage.setItem('fin_budget_mode', mode);
    
    const percentBtn = document.getElementById('budgetModePercent');
    const fixedBtn = document.getElementById('budgetModeFixed');
    
    if (percentBtn && fixedBtn) {
        if (mode === 'percentage') {
            percentBtn.className = "px-2 py-1 text-xs font-bold rounded bg-white shadow-sm text-indigo-600 dark:bg-slate-600";
            fixedBtn.className = "px-2 py-1 text-xs font-bold rounded text-slate-400";
        } else {
            percentBtn.className = "px-2 py-1 text-xs font-bold rounded text-slate-400";
            fixedBtn.className = "px-2 py-1 text-xs font-bold rounded bg-white shadow-sm text-indigo-600 dark:bg-slate-600";
        }
    }

    if (!document.getElementById('budgetPortionModal').classList.contains('hidden')) {
        updatePortionModalUnit(mode);
    }
    
    updateBudgetUI();
    showToast(`✅เปลี่ยนเป็นโหมด: ${mode === 'percentage' ? 'เปอร์เซ็นต์' : 'จำนวนเงินคงที่'}`);
}


        function validateTransaction() {
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('transDate').value;
    const category = document.getElementById('category').value;
    const desc = document.getElementById('desc').value.trim();
    
    if (!amount || amount <= 0 || isNaN(amount)) {
        showToast("กรุณาระบุยอดเงินที่ถูกต้อง");
        document.getElementById('amount').focus();
        return false;
    }
    
    if (amount > 1000000000) { 
        showToast("ยอดเงินสูงเกินไป");
        document.getElementById('amount').focus();
        return false;
    }
    
    if (!date) {
        showToast("กรุณาเลือกวันที่");
        document.getElementById('transDate').focus();
        return false;
    }
    
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    if (selectedDate > today) {
        showToast("ไม่สามารถเลือกวันที่ในอนาคตได้");
        document.getElementById('transDate').focus();
        return false;
    }
    
    if (!category) {
        showToast("กรุณาเลือกหมวดหมู่");
        document.getElementById('category').focus();
        return false;
    }
    
    if (!desc) {
        document.getElementById('desc').value = category;
    }
    
    return true;
}



async function saveTransactionToBackend(transactionData) {
    if (!isLoggedIn || !navigator.onLine) {
        addToSyncQueue(transactionData, 'create');
        return {
            success: false,
            offline: true,
            message: 'Offline, added to sync queue'
        };
    }
    
    try {
        let accountId = transactionData.accountId;
        
        if (!accountId || accountId === '' || accountId === 'null' || accountId === 'undefined') {
            const defaultAccount = accounts.find(a => a.isDefault);
            accountId = defaultAccount ? defaultAccount.id : 'default_acc';
        }
        
        accountId = String(accountId);
        
        const validTypes = ['income', 'expense', 'transfer'];
        const txType = transactionData.type;
        
        if (!txType || !validTypes.includes(txType)) {
            console.error('❌ Invalid transaction type:', txType);
            return {
                success: false,
                error: `Invalid transaction type: ${txType}`
            };
        }
        
        const payload = {
            user_id: currentUser.id,
            type: txType,
            amount: transactionData.amount,
            desc: transactionData.desc,
            category: transactionData.category,
            tag: transactionData.tag || '',
            icon: transactionData.icon,
            rawDate: transactionData.rawDate,
            month_key: transactionData.monthKey,
            accountId: accountId,
            transferToAccountId: transactionData.transferToAccountId || null,
            transferFromAccountId: transactionData.transferFromAccountId || null,
            transferType: transactionData.transferType || null,
            isDebtPayment: transactionData.isDebtPayment || false,
            originalDebtId: transactionData.originalDebtId || null,
            originalPaymentId: transactionData.originalPaymentId || null,
            isInitialBalance: transactionData.isInitialBalance || false
        };
        
        console.log('📤 saveTransactionToBackend payload:', payload);
        
        const response = await fetch(`${API_URL}/transactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ บันทึกที่ backend สำเร็จ, id:', result.id);
            console.log('✅ original_payment_id in response:', result.original_payment_id);
            
            // ✅ return ค่าครบถ้วน
            return {
                success: true,
                id: result.id.toString(),  // แปลงเป็น string
                message: result.message,
                original_payment_id: result.original_payment_id  // สำคัญ!
            };
        } else {
            console.error('❌ Backend error:', result);
            return {
                success: false,
                error: result.error || 'Unknown error'
            };
        }
        
    } catch (error) {
        console.error('❌ บันทึก backend ไม่สำเร็จ:', error);
        addToSyncQueue(transactionData, 'create');
        return {
            success: false,
            error: error.message
        };
    }
}

function getCurrentTransactions() {
    // ถ้า login และมีข้อมูลจาก backend ให้ใช้ backendTransactions
    if (isLoggedIn && backendTransactions && backendTransactions.length > 0) {
        console.log(`📊 ใช้ข้อมูลจาก backend: ${backendTransactions.length} รายการ`);
        return backendTransactions;
    }
    
    // ถ้าไม่มีให้ใช้ local transactions
    console.log(`📊 ใช้ข้อมูลจาก local: ${transactions.length} รายการ`);
    return transactions;
}

async function saveLoggedInTransaction(transactionData) {
    try {
        const checkbox = document.getElementById('saveToLocalCheckbox');
        if (checkbox) {
            saveToLocalEnabled = checkbox.checked;
        }
        
        // ตรวจสอบ accountId
        if (!transactionData.accountId || transactionData.accountId === '') {
            const defaultAccount = accounts.find(a => a.isDefault);
            transactionData.accountId = defaultAccount ? defaultAccount.id : 'default_acc';
        }
        transactionData.accountId = String(transactionData.accountId);
        
        const isUpdate = !!editingTxId;
        
        // ดึง transaction เดิม (กรณีแก้ไข)
        let oldTransaction = null;
        if (isUpdate) {
            oldTransaction = findTransactionById(editingTxId);
        }
        
        // ตรวจสอบความถูกต้องของ initial balance transaction
        const validation = validateInitialBalanceTransaction(transactionData, isUpdate, oldTransaction);
        if (!validation.valid) {
            showToast(validation.error, 'error');
            return;
        }
        
        if (window.financeDB) {
            window.financeDB.setSaveToLocalEnabled(saveToLocalEnabled);
        }
        
        let backendSuccess = false;
        let backendId = transactionData.id;
        
        const backendData = {
            ...transactionData,
            accountId: transactionData.accountId
        };
        
        console.log('📤 ส่งข้อมูลไป backend:', {
            ...backendData,
            accountId: backendData.accountId
        });
        
        // ✅ บันทึก MySQL ก่อน
        if (navigator.onLine) {
            let result;
            if (isUpdate) {
                result = await updateTransactionInBackend(backendData);
                if (result && result.success) {
                    backendId = result.id;
                    backendSuccess = true;
                }
            } else {
                result = await saveTransactionToBackend(backendData);
                if (result && result.id) {
                    backendId = result.id;
                    transactionData.id = backendId.toString();
                    transactionData.backendId = backendId;
                    backendSuccess = true;
                }
            }
        } else {
            if (!saveToLocalEnabled) {
                showToast('❌ ไม่สามารถบันทึกได้ (ต้อง online เพื่อบันทึกที่ MySQL)', 'error');
                return;
            }
            addToSyncQueue(transactionData, isUpdate ? 'update' : 'create');
            showToast('📦 ออฟไลน์: รอซิงค์อัตโนมัติ', 'info');
        }
        
        // ✅ ถ้าเป็น transaction initial balance ให้ sync กับ account.initialBalance
        if (transactionData.isInitialBalance) {
            const account = accounts.find(a => a.id === transactionData.accountId);
            if (account) {
                if (isUpdate) {
                    const oldAmount = account.initialBalance;
                    account.initialBalance = transactionData.amount;
                    console.log(`✅ อัปเดต account.initialBalance จาก ${oldAmount} เป็น ${account.initialBalance} for account ${account.name}`);
                    
                    if (isLoggedIn && navigator.onLine) {
                        await updateAccountInitialBalanceInBackend(account.id, account.initialBalance);
                    }
                } else {
                    const existingInitial = transactions.some(t => 
                        t.accountId === transactionData.accountId && 
                        t.isInitialBalance && 
                        t.id !== transactionData.id
                    );
                    if (!existingInitial) {
                        account.initialBalance = transactionData.amount;
                        console.log(`✅ ตั้งค่า account.initialBalance = ${account.initialBalance} for account ${account.name}`);
                        
                        if (isLoggedIn && navigator.onLine) {
                            await updateAccountInitialBalanceInBackend(account.id, account.initialBalance);
                        }
                    } else {
                        showToast('⚠️ บัญชีนี้มีรายการยอดเริ่มต้นอยู่แล้ว', 'error');
                        return;
                    }
                }
                saveAccounts();
            }
        }
        
        console.log('🔍 Before handleDebtPayment:', {
    isDebtPayment: transactionData.isDebtPayment,
    editingTxId: editingTxId,
    editingDebtPaymentId: window.editingDebtPaymentId
});

if (transactionData.isDebtPayment) {
    console.log('📞 Calling handleDebtPayment...');
    await handleDebtPayment(transactionData);
} else {
    console.log('⏭️ Skip handleDebtPayment (isDebtPayment = false)');
}

        // บันทึกในเครื่องตาม checkbox
        if (saveToLocalEnabled) {
            console.log('💾 Saving to local storage...');
            const result = await financeDB.saveTransaction(transactionData);
            if (result.success) {
                updateTransactionsArray(transactionData);
            }
        } else {
            console.log('☁️ Skip saving to local (saveToLocalEnabled = false)');
            // ถ้าไม่บันทึก local แต่ต้องการให้ transactions array มีข้อมูลปัจจุบัน
            if (editingTxId) {
                const index = transactions.findIndex(t => t.id === editingTxId);
                if (index !== -1) {
                    transactions[index] = transactionData;
                }
            } else {
                if (!transactions.some(t => t.id === transactionData.id)) {
                    transactions.unshift(transactionData);
                }
            }
        }
        
        if (isLoggedIn && navigator.onLine) {
            await loadTransactionsFromBackend();
            isShowingBackendData = true;
        }
        
        resetForm();
        updateUI();
        renderAccountsList();
        
        if (!document.getElementById('overview-calendar-content').classList.contains('hidden')) {
            renderCalendar();
        }
        refreshAnalysisCharts();
        
        let message = editingTxId ? "✏️ แก้ไขสำเร็จ" : "✅ บันทึกสำเร็จ";
        if (!saveToLocalEnabled) message += " (เฉพาะ MySQL)";
        showToast(message);
        
    } catch (error) {
        console.error('Error saving transaction:', error);
        showToast("❌ บันทึกไม่สำเร็จ: " + error.message);
    }
}

// ✅ เพิ่มฟังก์ชันใหม่สำหรับอัปเดต initialBalance ใน MySQL
async function updateAccountInitialBalanceInBackend(accountId, newInitialBalance) {
    if (!isLoggedIn || !navigator.onLine) return false;
    
    try {
        const account = accounts.find(a => a.id === accountId);
        if (!account) return false;
        
        const response = await fetch(`${API_URL}/accounts/${accountId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUser.id,
                name: account.name,
                type: account.type,
                icon: account.icon,
                initialBalance: newInitialBalance,
                isDefault: account.isDefault || false
            })
        });
        
        if (!response.ok) {
            throw new Error('อัปเดต initialBalance ไม่สำเร็จ');
        }
        
        console.log(`✅ อัปเดต initialBalance ใน MySQL: account ${accountId} = ${newInitialBalance}`);
        return true;
        
    } catch (error) {
        console.error('Error updating account initialBalance:', error);
        return false;
    }
}

function validateInitialBalanceTransaction(transactionData, isUpdate = false, oldTransaction = null) {
    // ตรวจสอบว่าเป็น initial balance transaction หรือไม่
    if (!transactionData.isInitialBalance) {
        return { valid: true };
    }
    
    // 1. ตรวจสอบ type ต้องเป็น 'income' เท่านั้น
    if (transactionData.type !== 'income') {
        return { 
            valid: false, 
            error: '⚠️ ไม่สามารถเปลี่ยนประเภทของรายการยอดเริ่มต้นบัญชีได้ (ต้องเป็นรายรับเท่านั้น)' 
        };
    }
    
    // 2. ตรวจสอบ category ต้องเป็น 'อื่นๆ'
    if (transactionData.category !== 'อื่นๆ') {
        return { 
            valid: false, 
            error: '⚠️ ไม่สามารถเปลี่ยนหมวดหมู่ของรายการยอดเริ่มต้นบัญชีได้' 
        };
    }
    
    // 3. กรณีเพิ่มใหม่: ตรวจสอบว่ามี initial balance อยู่แล้วหรือไม่
    if (!isUpdate) {
        const existingInitial = transactions.some(t => 
            t.accountId === transactionData.accountId && 
            t.isInitialBalance === true
        );
        
        if (existingInitial) {
            return { 
                valid: false, 
                error: '⚠️ บัญชีนี้มีรายการยอดเริ่มต้นอยู่แล้ว ไม่สามารถเพิ่มซ้ำได้' 
            };
        }
    }
    
    // 4. กรณีแก้ไข: ตรวจสอบว่าไม่ได้เปลี่ยน accountId
    if (isUpdate && oldTransaction && oldTransaction.accountId !== transactionData.accountId) {
        return { 
            valid: false, 
            error: '⚠️ ไม่สามารถเปลี่ยนบัญชีของรายการยอดเริ่มต้นได้' 
        };
    }
    
    return { valid: true };
}

async function saveGuestTransaction(transactionData) {
       console.log('👤 Guest mode - transactionData:', transactionData);
    console.log('👤 Guest mode - financeDB.saveToLocalEnabled:', financeDB?.saveToLocalEnabled);
    console.log('👤 Guest mode - financeDB.saveToIndexedDBEnabled:', financeDB?.saveToIndexedDBEnabled);
    try {
        if (!transactionData.accountId) {
            console.warn('⚠️ Guest mode: ไม่มี accountId, ใช้ default');
            const defaultAccount = accounts.find(a => a.isDefault);
            transactionData.accountId = defaultAccount ? defaultAccount.id : 'default_acc';
        }
        console.log('👤 Guest mode: กำลังบันทึก...');
        
        let result = await financeDB.saveTransaction(transactionData);
        
        if (!result || !result.success) {
            console.log('⚠️ Guest mode: FinanceDB ล้มเหลว, ใช้ localStorage โดยตรง');
            
            const localTx = JSON.parse(localStorage.getItem('fin_tx_v5') || '[]');
            localTx.unshift(transactionData);
            localStorage.setItem('fin_tx_v5', JSON.stringify(localTx.slice(0, 1000)));
            
            const exists = transactions.some(t => t.id === transactionData.id);
            if (!exists) {
                transactions.unshift(transactionData);
            }
            
            result = { success: true };
        }
        
        if (result.success) {
            const exists = transactions.some(t => t.id === transactionData.id);
            if (!exists) {
                transactions.unshift(transactionData);
            }
            
            resetForm();
            updateUI();
            
            if (!document.getElementById('overview-calendar-content').classList.contains('hidden')) {
                renderCalendar();
            }
            refreshAnalysisCharts();
            
            showToast("📱 บันทึกสำเร็จ (โหมดผู้เยี่ยมชม)");
        } else {
            showToast("❌ บันทึกไม่สำเร็จ");
        }
    } catch (error) {
        console.error('Guest save error:', error);
        
        try {
            console.log('⚠️ Guest mode: เกิด error, ใช้ localStorage โดยตรง');
            const localTx = JSON.parse(localStorage.getItem('fin_tx_v5') || '[]');
            localTx.unshift(transactionData);
            localStorage.setItem('fin_tx_v5', JSON.stringify(localTx.slice(0, 1000)));
            
            const exists = transactions.some(t => t.id === transactionData.id);
            if (!exists) {
                transactions.unshift(transactionData);
            }
            
            resetForm();
            updateUI();
            renderCalendar();
            refreshAnalysisCharts();
            
            showToast("📱 บันทึกสำเร็จ (โหมดผู้เยี่ยมชม - fallback)");
        } catch (fallbackError) {
            console.error('Fallback also failed:', fallbackError);
            showToast("❌ บันทึกไม่สำเร็จ: " + error.message);
        }
    }
}

async function fixNullAccountIds() {
    console.log('🔧 เริ่มตรวจสอบและแก้ไข accountId ที่เป็น null...');
    
    const allTx = await financeDB.getAllTransactions();
    let fixedCount = 0;
    
    const defaultAccount = accounts.find(a => a.isDefault);
    const defaultId = defaultAccount ? defaultAccount.id : 'default_acc';
    
    for (const tx of allTx) {
        if (!tx.accountId) {
            console.log('⚠️ พบ transaction ที่ accountId = null:', tx.id);
            
            tx.accountId = defaultId;
            
            await financeDB.saveTransaction(tx);
            fixedCount++;
        }
    }
    
    console.log(`✅ แก้ไขเรียบร้อย: ${fixedCount} รายการ`);
    
    await loadInitialData();
    updateUI();
    
    return fixedCount;
}

async function updateTransactionInBackend(transactionData) {
    if (!isLoggedIn || !navigator.onLine) {
        addToSyncQueue(transactionData, 'update');
        return false;
    }
    
    if (transactionData.id.toString().startsWith('tx_')) {
        return saveTransactionToBackend(transactionData);
    }
    
    try {
        console.log('📤 Updating transaction:', {
            id: transactionData.id,
            isDebtPayment: transactionData.isDebtPayment,
            originalPaymentId: transactionData.originalPaymentId,
            originalDebtId: transactionData.originalDebtId
        });
        
        const response = await fetch(`${API_URL}/transactions/${transactionData.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUser.id,
                type: transactionData.type,
                amount: transactionData.amount,
                desc: transactionData.desc,
                category: transactionData.category,
                tag: transactionData.tag || '',
                icon: transactionData.icon,
                date: transactionData.rawDate,
                month_key: transactionData.monthKey,
                account_id: transactionData.accountId,
                transfer_to_account_id: transactionData.transferToAccountId || null,
                transfer_from_account_id: transactionData.transferFromAccountId || null,
                transfer_type: transactionData.transferType || null,
                is_debt_payment: transactionData.isDebtPayment || false,     // ✅ สำคัญ!
                original_debt_id: transactionData.originalDebtId || null,    // ✅ สำคัญ!
                original_payment_id: transactionData.originalPaymentId || null, // ✅ สำคัญ!
                is_initial_balance: transactionData.isInitialBalance || false
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ แก้ไขที่ backend สำเร็จ');
            return { success: true, id: transactionData.id };
        } else {
            const result = await response.json();
            console.error('Backend error:', result);
            throw new Error(result.error || 'Unknown error');
        }
        
    } catch (error) {
        console.error('❌ แก้ไข backend ไม่สำเร็จ:', error);
        addToSyncQueue(transactionData, 'update');
        return { success: false, error: error.message };
    }
}

async function deleteTransactionFromBackend(transactionId) {
    console.log('🗑️ deleteTransactionFromBackend START, id:', transactionId);
    
    if (!isLoggedIn) {
        console.log('❌ Not logged in');
        return false;
    }
    
    if (!navigator.onLine) {
        console.log('❌ Offline');
        return false;
    }
    
    if (transactionId.toString().startsWith('tx_')) {
        console.log('⚠️ Skip: temporary ID');
        return true;
    }
    
    try {
        const url = `${API_URL}/transactions/${transactionId}?user_id=${currentUser.id}`;
        console.log('📡 DELETE request to:', url);
        
        const response = await fetch(url, {
            method: 'DELETE'
        });
        
        console.log('📡 Response status:', response.status);
        
        if (response.ok) {
            console.log('✅ ลบที่ backend สำเร็จ');
            return true;
        } else {
            const result = await response.json();
            console.error('❌ ลบ backend ไม่สำเร็จ:', result);
            return false;
        }
        
    } catch (error) {
        console.error('❌ Error deleting from backend:', error);
        return false;
    }
}

async function saveAccountToBackend(accountData) {
    if (!isLoggedIn || !navigator.onLine) return false;
    
    try {
        const response = await fetch(`${API_URL}/accounts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUser.id,
                name: accountData.name,
                type: accountData.type,
                icon: accountData.icon,
                initialBalance: accountData.initialBalance || 0,  // ✅ ส่ง initialBalance
                isDefault: accountData.isDefault || false
            })
        });
        
        const result = await response.json();
        
        if (response.ok && result.id) {
            console.log('✅ บันทึก account ที่ backend สำเร็จ');
            
            accountData.id = result.id.toString();
            accountData.numericId = result.id;
            saveAccounts();
            
            return true;
        }
        return false;
        
    } catch (error) {
        console.error('❌ บันทึก account ไม่สำเร็จ:', error);
        return false;
    }
}

async function saveBudgetsToBackend() {
    if (!isLoggedIn || !navigator.onLine) return false;
    
    const monthKey = getMonthKey();
    const budgets = categoryTargets[monthKey] || {};
    
    try {
        const response = await fetch(`${API_URL}/budgets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUser.id,
                month_key: monthKey,
                budgets: budgets
            })
        });
        
        if (response.ok) {
            console.log('✅ บันทึก budgets ที่ backend สำเร็จ');
            return true;
        }
        return false;
        
    } catch (error) {
        console.error('❌ บันทึก budgets ไม่สำเร็จ:', error);
        return false;
    }
}




async function handleDebtPayment(transactionData) {
    console.log('🔵 ========== handleDebtPayment START ==========');
    console.log('🔵 transactionData:', {
        id: transactionData.id,
        amount: transactionData.amount,
        type: transactionData.type,
        isDebtPayment: transactionData.isDebtPayment,
        originalPaymentId: transactionData.originalPaymentId,
        originalDebtId: transactionData.originalDebtId,
        accountId: transactionData.accountId,
        rawDate: transactionData.rawDate,
        desc: transactionData.desc
    });
    console.log('🔵 Global variables:', {
        editingTxId: editingTxId,
        window_editingDebtPaymentId: window.editingDebtPaymentId,
        isLoggedIn: isLoggedIn,
        saveToLocalEnabled: saveToLocalEnabled,
        navigator_onLine: navigator.onLine
    });
    
    // ✅ กรณีแก้ไข debt payment (จากหน้า overview)
    if (editingTxId && window.editingDebtPaymentId) {
        console.log('✅ Case 1: Editing existing debt payment from overview');
        console.log('   editingTxId:', editingTxId);
        console.log('   window.editingDebtPaymentId:', window.editingDebtPaymentId);
        
        // ค้นหา transaction เดิม
        const originalTransaction = transactions.find(t => t.id === editingTxId);
        console.log('🔍 Original transaction found:', originalTransaction ? {
            id: originalTransaction.id,
            isDebtPayment: originalTransaction.isDebtPayment,
            originalPaymentId: originalTransaction.originalPaymentId,
            originalDebtId: originalTransaction.originalDebtId,
            amount: originalTransaction.amount
        } : 'NOT FOUND');
        
        if (originalTransaction?.isDebtPayment) {
            console.log('✅ Original transaction is debt payment, proceeding...');
            
            // ตั้งค่าให้ transactionData
            transactionData.isDebtPayment = true;
            transactionData.originalPaymentId = originalTransaction.originalPaymentId;
            transactionData.originalDebtId = originalTransaction.originalDebtId;
            console.log('📝 Updated transactionData:', {
                isDebtPayment: transactionData.isDebtPayment,
                originalPaymentId: transactionData.originalPaymentId,
                originalDebtId: transactionData.originalDebtId
            });
            
            // ค้นหา payment record
            const paymentIndex = payments.findIndex(p => p.id === window.editingDebtPaymentId);
            console.log('🔍 Payment index in payments array:', paymentIndex);
            console.log('🔍 Current payments array:', payments.map(p => ({ id: p.id, amount: p.amount, debtId: p.debtId })));
            
            if (paymentIndex !== -1) {
                const oldPayment = payments[paymentIndex];
                console.log('📦 Old payment data:', {
                    id: oldPayment.id,
                    amount: oldPayment.amount,
                    date: oldPayment.date,
                    accountId: oldPayment.accountId,
                    note: oldPayment.note
                });
                
                // สร้าง updated payment
                const updatedPayment = {
                    ...oldPayment,
                    amount: transactionData.amount,
                    date: transactionData.rawDate,
                    note: transactionData.desc,
                    updatedAt: new Date().toISOString()
                };
                console.log('🔄 Updated payment data:', {
                    id: updatedPayment.id,
                    oldAmount: oldPayment.amount,
                    newAmount: updatedPayment.amount,
                    oldDate: oldPayment.date,
                    newDate: updatedPayment.date
                });
                
                // อัปเดตใน memory
                payments[paymentIndex] = updatedPayment;
                console.log('✅ Updated payments array in memory');
                
                // ✅ บันทึก payment ไป MySQL
                if (isLoggedIn && navigator.onLine) {
                    console.log('🌐 Online - Updating payment in MySQL...');
                    console.log('📤 Sending to updateDebtPaymentInBackend:', {
                        id: updatedPayment.id,
                        debtId: updatedPayment.debtId,
                        accountId: updatedPayment.accountId,
                        amount: updatedPayment.amount,
                        date: updatedPayment.date,
                        note: updatedPayment.note
                    });
                    
                    const success = await updateDebtPaymentInBackend({
                        id: updatedPayment.id,
                        debtId: updatedPayment.debtId,
                        accountId: updatedPayment.accountId,
                        amount: updatedPayment.amount,
                        date: updatedPayment.date,
                        note: updatedPayment.note
                    });
                    
                    console.log('📡 updateDebtPaymentInBackend result:', success);
                    
                    if (success) {
                        console.log('✅ Payment updated in MySQL successfully');
                    } else {
                        console.error('❌ Failed to update payment in MySQL');
                    }
                } else if (isLoggedIn && !navigator.onLine && saveToLocalEnabled) {
                    console.log('📱 Offline - Adding payment update to sync queue');
                    addToSyncQueue(updatedPayment, 'update_payment');
                    showToast('📦 ออฟไลน์: รอซิงค์อัตโนมัติ', 'info');
                } else {
                    console.log('⚠️ Skip MySQL update - conditions not met:', {
                        isLoggedIn: isLoggedIn,
                        navigator_onLine: navigator.onLine,
                        saveToLocalEnabled: saveToLocalEnabled
                    });
                }
                
                // บันทึก local เฉพาะเมื่อ saveToLocalEnabled = true
                if (saveToLocalEnabled) {
                    savePaymentsToStorage();
                    console.log('💾 Saved payment to local storage');
                } else {
                    console.log('⏭️ Skip saving payment to local (saveToLocalEnabled = false)');
                }
            } else {
                console.log('❌ Payment not found in payments array!');
                console.log('   Searching for payment with id:', window.editingDebtPaymentId);
                console.log('   Available payment ids:', payments.map(p => p.id));
            }
        } else {
            console.log('⚠️ Original transaction is NOT a debt payment:', {
                isDebtPayment: originalTransaction?.isDebtPayment,
                id: originalTransaction?.id
            });
        }
        
        console.log('🔵 ========== handleDebtPayment END (Edit Case) ==========');
        return;
    }
    
    // ✅ กรณีสร้าง debt payment ใหม่ (จากหน้า debt)
    if (!editingTxId && transactionData.isDebtPayment && transactionData.originalPaymentId) {
        console.log('✅ Case 2: Creating new debt payment from debt page');
        console.log('   originalPaymentId:', transactionData.originalPaymentId);
        console.log('   originalDebtId:', transactionData.originalDebtId);
        
        // ตรวจสอบว่า payment มีอยู่แล้วหรือยัง
        const existingPayment = payments.find(p => p.id === transactionData.originalPaymentId);
        console.log('🔍 Existing payment found:', existingPayment ? 'YES' : 'NO');
        
        if (!existingPayment) {
            const newPayment = {
                id: transactionData.originalPaymentId,
                debtId: transactionData.originalDebtId,
                accountId: transactionData.accountId,
                amount: transactionData.amount,
                date: transactionData.rawDate,
                note: transactionData.desc,
                createdAt: new Date().toISOString()
            };
            console.log('📦 New payment object:', newPayment);
            
            payments.push(newPayment);
            console.log('✅ Added new payment to payments array');
            console.log('   Current payments count:', payments.length);
            
            // บันทึก payment ไป MySQL
            if (isLoggedIn && navigator.onLine) {
                console.log('🌐 Online - Saving new payment to MySQL...');
                await saveDebtPaymentToBackend(newPayment);
                console.log('✅ New payment saved to MySQL');
            } else if (isLoggedIn && !navigator.onLine && saveToLocalEnabled) {
                console.log('📱 Offline - Adding new payment to sync queue');
                addToSyncQueue(newPayment, 'create_payment');
                showToast('📦 ออฟไลน์: รอซิงค์อัตโนมัติ', 'info');
            }
            
            // บันทึก local เฉพาะเมื่อ saveToLocalEnabled = true
            if (saveToLocalEnabled) {
                savePaymentsToStorage();
                console.log('💾 Saved new payment to local storage');
            } else {
                console.log('⏭️ Skip saving new payment to local (saveToLocalEnabled = false)');
            }
        } else {
            console.log('⚠️ Payment already exists, skipping creation');
        }
        
        console.log('🔵 ========== handleDebtPayment END (Create Case) ==========');
        return;
    }
    
    // ✅ กรณีอื่นๆ ที่ไม่เข้าเงื่อนไข
    console.log('⚠️ Case 3: No matching condition');
    console.log('   Conditions checked:');
    console.log('   - editingTxId && window.editingDebtPaymentId:', !!(editingTxId && window.editingDebtPaymentId));
    console.log('   - !editingTxId && transactionData.isDebtPayment && transactionData.originalPaymentId:', 
        !!(!editingTxId && transactionData.isDebtPayment && transactionData.originalPaymentId));
    console.log('🔵 ========== handleDebtPayment END (No Match) ==========');
}

async function handleMonthChange(transactionData) {
    if (!editingTxId) return;
    
    const oldTransaction = transactions.find(t => t.id === editingTxId);
    if (oldTransaction && oldTransaction.monthKey !== transactionData.monthKey) {
        try {
            await financeDB.deleteTransaction(editingTxId);
            transactions = transactions.filter(t => t.id !== editingTxId);
        } catch (error) {
            console.error('ลบ transaction เดิมไม่สำเร็จ:', error);
        }
    }
}





async function saveToServer(transactionData) {
    const method = editingTxId ? 'PUT' : 'POST';
    const url = editingTxId 
        ? `${API_URL}/transactions/${editingTxId}`
        : `${API_URL}/transactions`;
    
    const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'บันทึกไม่สำเร็จ');
    }
    
    return await response.json();
}

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('FlowWalletDB', 1);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('transactions')) {
                db.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true });
            }
        };
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}


function getLocalTransactions() {
    try {
        return JSON.parse(localStorage.getItem('fin_tx_v5') || '[]');
    } catch (e) {
        return [];
    }
}



function saveToLocalStorage(transaction) {
    const localTx = getLocalTransactions();
    localTx.unshift(transaction);
    localStorage.setItem('fin_tx_v5', JSON.stringify(localTx.slice(0, 1000)));
}


function updateTransactionsArray(transactionData) {
    if (!saveToLocalEnabled && isLoggedIn) {
        console.log('⏭️ ข้ามการอัพเดต transactions array (ไม่บันทึกในเครื่อง)');
        return;
    }
    
    if (editingTxId) {
        const index = transactions.findIndex(t => t.id === editingTxId);
        if (index >= 0) {
            transactions[index] = transactionData;
        } else {
            transactions.unshift(transactionData);
        }
    } else {
        const exists = transactions.some(t => t.id === transactionData.id);
        if (!exists) {
            transactions.unshift(transactionData);
        }
    }
    
    console.log('📝 transactions array อัพเดตแล้ว, length:', transactions.length);
}

async function cleanupLocalTransactions() {
    if (!isLoggedIn) return;
    
    const localTransactions = transactions.filter(t => 
        t.id.toString().startsWith('tx_') && !t.backendId
    );
    
    if (localTransactions.length > 0) {
        console.log(`🧹 พบ local transactions ${localTransactions.length} รายการ กำลังลบ...`);
        
        for (const t of localTransactions) {
            await financeDB.deleteTransaction(t.id);
        }
        
        transactions = transactions.filter(t => 
            !t.id.toString().startsWith('tx_') || t.backendId
        );
        
        console.log(`✅ ลบ local transactions แล้ว`);
    }
}




function updateUIAfterSave() {
    resetForm();
    updateUI();
    
    if (!document.getElementById('overview-calendar-content').classList.contains('hidden')) {
        renderCalendar();
    }
    refreshAnalysisCharts();
}


function getGuestId() {
    let guestId = localStorage.getItem('guest_id');
    if (!guestId) {
        guestId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('guest_id', guestId);
        console.log('🆕 สร้าง Guest ID ใหม่:', guestId);
    }
    return guestId;
}

function addToSyncQueue(transactionData) {
    let queue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
    queue.push({
        data: transactionData,
        method: editingTxId ? 'PUT' : 'POST',
        timestamp: Date.now()
    });
    localStorage.setItem('syncQueue', JSON.stringify(queue));
    
    showSyncNotification();
}

function showSyncNotification() {
    const noti = document.getElementById('sync-notification');
    if (noti) noti.style.display = 'block';
}

async function saveTransaction() {
    const amt = parseFloat(document.getElementById('amount').value); 
    if (!amt) return showToast("ระบุยอดเงิน");
    
    const transactionData = prepareTransactionData();
    
    await handleDebtPayment(transactionData);
    await handleMonthChange(transactionData);
    
    if (isLoggedIn) {
        await saveLoggedInTransaction(transactionData);
    } else {
        await saveGuestTransaction(transactionData);
    }
}

// ใน prepareTransactionData() - ตรวจสอบและกำหนดค่า accountId ให้ถูกต้อง
function prepareTransactionData() {
    const amt = parseFloat(document.getElementById('amount').value);
    const catL = document.getElementById('category').value;
    const cI = [...customCategories.income, ...customCategories.spending, ...customCategories.investment]
        .find(c => c.label === catL);
    const rD = document.getElementById('transDate').value;
    const d = new Date(rD);
    const newMonthKey = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    
    let accountId = document.getElementById('accountSelect')?.value;
    if (!accountId || accountId === '') {
        accountId = currentAccountId;
    }
    if (!accountId) {
        const defaultAccount = accounts.find(a => a.isDefault);
        accountId = defaultAccount ? defaultAccount.id : 'default_acc';
    }
    accountId = String(accountId);

    let isInitialBalance = false;
    let isDebtPayment = false;
    let originalPaymentId = null;
    let originalDebtId = null;
    
    if (editingTxId) {
        const oldTx = findTransactionById(editingTxId);
        if (oldTx) {
            if (oldTx.isInitialBalance) {
                isInitialBalance = true;
                if (oldTx.accountId !== accountId) {
                    showToast('⚠️ ไม่สามารถเปลี่ยนบัญชีของรายการยอดเริ่มต้นได้', 'error');
                    accountId = oldTx.accountId;
                    document.getElementById('accountSelect').value = accountId;
                }
            }
            
            // ✅ สำคัญ: คงค่า isDebtPayment และ originalPaymentId ไว้
            if (oldTx.isDebtPayment) {
                isDebtPayment = true;
                originalPaymentId = oldTx.originalPaymentId;
                originalDebtId = oldTx.originalDebtId;
                console.log('🔍 Editing debt payment - keeping isDebtPayment=true, originalPaymentId=', originalPaymentId);
            } else {
                console.log('🔍 Editing non-debt payment - isDebtPayment=', oldTx.isDebtPayment);
            }
        }
    }
    
    return {
        id: editingTxId || `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: amt,
        type: currentType,
        category: catL,
        icon: cI ? cI.icon : '❓',
        desc: document.getElementById('desc').value.trim() || catL,
        tag: document.getElementById('tagInput').value.trim(),
        accountId: accountId,
        monthKey: newMonthKey,
        rawDate: rD,
        date: rD,
        isInitialBalance: isInitialBalance,
        isDebtPayment: isDebtPayment,           // ✅ สำคัญ!
        originalPaymentId: originalPaymentId,    // ✅ สำคัญ!
        originalDebtId: originalDebtId,          // ✅ สำคัญ!
        createdAt: editingTxId ? undefined : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner_type: isLoggedIn ? 'user' : 'guest',
        owner_id: isLoggedIn ? currentUser.id : getGuestId()
    };
}


async function handleMonthChange(transactionData) {
    if (!editingTxId) return;
    
    const oldTransaction = transactions.find(t => t.id === editingTxId);
    if (oldTransaction && oldTransaction.monthKey !== transactionData.monthKey) {
        try {
            await financeDB.deleteTransaction(editingTxId);
            transactions = transactions.filter(t => t.id !== editingTxId);
        } catch (error) {
            console.error('ลบ transaction เดิมไม่สำเร็จ:', error);
        }
    }
}

function updateTransactionsArray(transactionData) {
    if (editingTxId) {
        const index = transactions.findIndex(t => t.id === editingTxId);
        if (index >= 0) {
            transactions[index] = transactionData;
        } else {
            transactions.unshift(transactionData);
        }
    } else {
        const exists = transactions.some(t => t.id === transactionData.id);
        if (!exists) {
            transactions.unshift(transactionData);
        }
    }
}

function updateUIAfterSave() {
    resetForm();
    updateUI();
    
    if (!document.getElementById('overview-calendar-content').classList.contains('hidden')) {
        renderCalendar();
    }
    refreshAnalysisCharts();
}

function resetForm() { 
    editingTxId = null;
    window.editingDebtPaymentId = null;
    document.getElementById('formTitle').innerText = "บันทึกรายการ"; 
    document.getElementById('submitBtn').innerText = "บันทึก"; 
    document.getElementById('cancelEditBtn').classList.add('hidden'); 
    document.getElementById('amount').value = ''; 
    document.getElementById('desc').value = ''; 
    document.getElementById('tagInput').value = ''; 
    setDefaultDate(); 
    updateTagSuggestions();
    
    // ✅ เพิ่ม: รีเซ็ตฟิลด์ที่ถูก disable
    const categorySelect = document.getElementById('category');
    const accountSelect = document.getElementById('accountSelect');
    const btnIncome = document.getElementById('btn-income');
    const btnExpense = document.getElementById('btn-expense');
    
    if (categorySelect) categorySelect.disabled = false;
    if (accountSelect) accountSelect.disabled = false;
    if (btnIncome) btnIncome.disabled = false;
    if (btnExpense) btnExpense.disabled = false;
    
    // ✅ ลบ warning message
    const warning = document.getElementById('initialBalanceWarning');
    if (warning) warning.remove();
}
        
function editTransaction(id) { 
    const transaction = findTransactionById(id);
    if (!transaction) return;

    editingTxId = transaction.id;
    
    console.log('🖥️ Desktop edit - Transaction:', transaction);
    console.log('🔍 isDebtPayment:', transaction.isDebtPayment);
    console.log('🔍 originalPaymentId:', transaction.originalPaymentId);

    if (isMobile()) {
        openMobileForm(transaction);
    } else {
        editingTxId = id; 
        document.getElementById('formTitle').innerText = "แก้ไข"; 
        document.getElementById('submitBtn').innerText = "อัปเดต"; 
        document.getElementById('cancelEditBtn').classList.remove('hidden'); 
        
        setType(transaction.type); 
        document.getElementById('amount').value = transaction.amount; 
        document.getElementById('desc').value = transaction.desc === transaction.category ? "" : transaction.desc;
        document.getElementById('tagInput').value = transaction.tag || ""; 
        document.getElementById('transDate').value = transaction.rawDate; 
        document.getElementById('category').value = transaction.category;
        
        if (document.getElementById('accountSelect')) {
            document.getElementById('accountSelect').value = transaction.accountId;
        }
        
        // ✅ สำหรับ debt payment: เก็บ originalPaymentId เสมอ (ไม่ว่า checkbox จะติ๊กหรือไม่)
        if (transaction.isDebtPayment && transaction.originalPaymentId) {
            console.log('🏦 Editing debt payment, paymentId:', transaction.originalPaymentId);
            window.editingDebtPaymentId = transaction.originalPaymentId;
            
            // แสดงข้อความเตือน
            if (!document.getElementById('debtPaymentWarning')) {
                const warningMsg = document.createElement('div');
                warningMsg.id = 'debtPaymentWarning';
                warningMsg.className = 'text-blue-500 text-xs mt-2 p-2 bg-blue-50 rounded-lg';
                warningMsg.innerHTML = '💰 รายการนี้เป็นรายการผ่อนหนี้ - การแก้ไขจะอัปเดตประวัติการชำระหนี้ด้วย';
                const submitBtn = document.getElementById('submitBtn');
                if (submitBtn && !document.getElementById('initialBalanceWarning')) {
                    submitBtn.insertAdjacentHTML('beforebegin', warningMsg.outerHTML);
                }
            }
        } else {
            console.log('⚠️ Not a debt payment or missing originalPaymentId');
            window.editingDebtPaymentId = null;
            const warning = document.getElementById('debtPaymentWarning');
            if (warning) warning.remove();
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
        
        setTimeout(() => {
            document.getElementById('amount').focus();
        }, 300);
    }
}
        
async function deleteTransaction(id, skipConfirm = false) { 
    console.log('🗑️ deleteTransaction START, id:', id);
    
    const transaction = findTransactionById(id);
    if (!transaction) {
        showToast("❌ ไม่พบรายการที่ต้องการลบ");
        return;
    }
    
    if (!skipConfirm) {
        showConfirm("ลบรายการ?", "ลบแล้วกู้คืนไม่ได้", async () => { 
            await performDelete(transaction, id);
        });
    } else {
        await performDelete(transaction, id);
    }
}

// แยก logic การลบออกมา
async function performDelete(transaction, id) {
    try {
        const isDebtPayment = transaction.isDebtPayment;
        const originalPaymentId = transaction.originalPaymentId;
        const isInitialBalance = transaction.isInitialBalance;
        const accountId = transaction.accountId;
        
        const saveToLocalCheckbox = document.getElementById('saveToLocalCheckbox');
        const shouldSaveToLocal = saveToLocalCheckbox ? saveToLocalCheckbox.checked : true;
        
        console.log('🔍 [performDelete] checkbox.checked:', shouldSaveToLocal);
        console.log('🔍 [performDelete] saveToLocalEnabled before:', saveToLocalEnabled);
        console.log('🔍 [performDelete] isDebtPayment:', isDebtPayment);
        console.log('🔍 [performDelete] originalPaymentId:', originalPaymentId);
        
        if (window.financeDB) {
            window.financeDB.setSaveToLocalEnabled(shouldSaveToLocal);
        }
        
        // ✅ 1. ลบ payment record ที่เกี่ยวข้อง (ถ้าเป็น debt payment)
        if (isDebtPayment && originalPaymentId) {
            console.log('🗑️ Found related payment, deleting payment id:', originalPaymentId);
            
            // ลบจาก backend (MySQL)
            if (isLoggedIn && navigator.onLine && !originalPaymentId.toString().startsWith('payment_')) {
                console.log('📡 Calling deleteDebtPaymentFromBackend for payment id:', originalPaymentId);
                await deleteDebtPaymentFromBackend(originalPaymentId);
            } else if (isLoggedIn && !navigator.onLine) {
                console.log('📱 Offline - adding payment deletion to sync queue');
                addToSyncQueue({ id: originalPaymentId }, 'delete_payment');
            }
            
            // ลบจาก payments array ใน memory
            const paymentIndex = payments.findIndex(p => p.id === originalPaymentId || p.id === originalPaymentId.toString());
            if (paymentIndex !== -1) {
                payments.splice(paymentIndex, 1);
                console.log('✅ ลบ payment record ใน memory:', originalPaymentId);
                
                // บันทึก local storage
                if (saveToLocalEnabled) {
                    savePaymentsToStorage();
                }
            } else {
                console.log('⚠️ Payment not found in memory:', originalPaymentId);
            }
        }
        
        // ✅ 2. ลบ transaction จาก backend (MySQL)
        if (isLoggedIn && navigator.onLine && !id.toString().startsWith('tx_')) {
            console.log('📡 Calling deleteTransactionFromBackend for id:', id);
            await deleteTransactionFromBackend(id);
        } else if (isLoggedIn && !navigator.onLine) {
            console.log('📱 Offline - adding to sync queue');
            addToSyncQueue({ id: id }, 'delete');
        }
        
        // ✅ 3. ลบจากเครื่อง (IndexedDB + localStorage)
        const result = await financeDB.deleteTransaction(id);
        console.log('Delete result from financeDB:', result);
        
        if (result.success) {
            // ลบจาก arrays
            transactions = transactions.filter(t => t.id !== id);
            if (backendTransactions && backendTransactions.length > 0) {
                backendTransactions = backendTransactions.filter(t => t.id !== id);
            }
            
            // ✅ ถ้าลบ initial balance transaction ให้ set account.initialBalance = 0
            if (isInitialBalance && accountId) {
                const account = accounts.find(a => a.id === accountId);
                if (account) {
                    const remainingInitial = transactions.some(t => 
                        t.accountId === accountId && 
                        t.isInitialBalance && 
                        t.id !== id
                    );
                    if (!remainingInitial) {
                        account.initialBalance = 0;
                        saveAccounts();
                        console.log(`✅ ลบ initial balance: set account.initialBalance = 0 for ${account.name}`);
                    }
                }
            }
            
            // ✅ โหลดข้อมูลใหม่ทั้งหมดเพื่อความถูกต้อง
            if (isLoggedIn && navigator.onLine) {
                console.log('🔄 Reloading all data after deletion...');
                await Promise.all([
                    loadTransactionsFromBackend(),
                    loadDebtsFromBackend(),
                    loadPaymentsFromBackend()
                ]);
                transactions = backendTransactions;
            }
            
            updateUI();
            renderAccountsList();
            renderCalendar();
            refreshAnalysisCharts();
            await clearRecentCache();
            
            // ✅ รีเฟรชหน้า debt ถ้าอยู่ในหน้านั้น
            if (getCurrentPage() === 'debt') {
                renderDebtPage();
            }
            
            showToast("✅ ลบรายการสำเร็จ");
        } else {
            showToast("❌ ลบไม่สำเร็จ");
        }
        
        hideConfirm();
        
    } catch (error) {
        console.error('Error deleting transaction:', error);
        hideConfirm();
        showToast("❌ ลบไม่สำเร็จ: " + error.message);
    }
}

        function toggleSettingsModal() { document.getElementById('settingsModal').classList.toggle('hidden'); }
        function openManageTagsModal() { document.getElementById('manageTagsModal').classList.remove('hidden'); renderTagList(); toggleSettingsModal(); }
        function closeManageTagsModal() { document.getElementById('manageTagsModal').classList.add('hidden'); }
        function openManageCatsModal() { document.getElementById('manageCatsModal').classList.remove('hidden'); setManageType(currentManageType); toggleSettingsModal(); }
        function closeManageCatsModal() { document.getElementById('manageCatsModal').classList.add('hidden'); }
        function toggleIconPicker() { document.getElementById('iconPickerContainer').classList.toggle('hidden'); }
        function selectIcon(el, icon) { document.querySelectorAll('.icon-item').forEach(i => i.classList.remove('selected')); el.classList.add('selected'); selectedIcon = icon; document.getElementById('selectedIconDisplay').innerText = icon; toggleIconPicker(); }
        function setManageType(t) { currentManageType = t; ['income', 'spending', 'investment'].forEach(x => { const b = document.getElementById(`mcat-${x}`); b.className = x === t ? "flex-1 py-1.5 rounded-lg bg-white text-indigo-600 shadow-sm font-bold text-[10px] dark:bg-slate-600" : "flex-1 py-1.5 rounded-lg text-slate-500 font-bold text-[10px]"; }); renderCatList(); }
        function renderCatList() { const c = customCategories[currentManageType]; document.getElementById('catListContainer').innerHTML = c.map(x => `<div class="p-2 bg-slate-50 border border-slate-100 rounded-xl flex justify-between dark:bg-slate-800/50"><span>${x.icon} ${x.label}</span><div class="flex gap-1"><button onclick="prepareEditCat('${x.id}')" class="text-indigo-400 text-xs">✎</button><button onclick="deleteCategory('${x.id}')" class="text-rose-400 text-xs">✕</button></div></div>`).join(''); }
        function prepareEditCat(id) { editingCatId = id; const c = customCategories[currentManageType].find(x => x.id === id); document.getElementById('newCatName').value = c.label; selectedIcon = c.icon; document.getElementById('selectedIconDisplay').innerText = c.icon; document.getElementById('saveCatBtn').innerText = "บันทึก"; document.getElementById('cancelCatEditBtn').classList.remove('hidden'); }
        function cancelCatEdit() { editingCatId = null; document.getElementById('newCatName').value = ''; selectedIcon = '📁'; document.getElementById('selectedIconDisplay').innerText = '📁'; document.getElementById('saveCatBtn').innerText = "เพิ่ม"; document.getElementById('cancelCatEditBtn').classList.add('hidden'); }
        function saveNewCategory() {
            const name = document.getElementById('newCatName').value.trim(); if (!name) return;
            if (editingCatId) { const idx = customCategories[currentManageType].findIndex(x => x.id === editingCatId); customCategories[currentManageType][idx] = { ...customCategories[currentManageType][idx], label: name, icon: selectedIcon }; }
            else { customCategories[currentManageType].push({ id: Date.now().toString(), label: name, icon: selectedIcon }); }
            localStorage.setItem('fin_custom_cats', JSON.stringify(customCategories)); updateCategorySelect(); cancelCatEdit(); renderCatList(); showToast("สำเร็จ");
        }
        function deleteCategory(id) { customCategories[currentManageType] = customCategories[currentManageType].filter(x => x.id !== id); localStorage.setItem('fin_custom_cats', JSON.stringify(customCategories)); renderCatList(); updateCategorySelect(); }
        function openPortionModal(id, isInv) {
            editingCatId = id; const c = [...customCategories.spending, ...customCategories.investment].find(x => x.id === id);
            document.getElementById('modalIcon').innerText = c.icon; document.getElementById('portionCatName').innerText = c.label;
                        const hintText = budgetMode === 'percentage' 
                ? (isInv ? "% จากงบลงทุน" : "% จากรายได้")
                : "จำนวนเงินคงที่ (บาท)";
            document.getElementById('modalHint').innerText = hintText;
            const unitElement = document.getElementById('targetUnit');
            if (unitElement) {
                unitElement.textContent = budgetMode === 'percentage' ? '%' : '฿';
            }
            const target = categoryTargets[getMonthKey()]?.[id];
            const val = target?.value;
            const mode = target?.mode || 'percentage';
            
    if (target && mode) {
        const newHintText = mode === 'percentage' 
            ? (isInv ? "% จากงบลงทุน" : "% จากรายได้")
            : "จำนวนเงินคงที่ (บาท)";
        document.getElementById('modalHint').innerText = newHintText;
        
        if (unitElement) {
            unitElement.textContent = mode === 'percentage' ? '%' : '฿';
        }
    }
            

            document.getElementById('targetAmountInput').value = val === undefined ? '' : val;
            document.getElementById('budgetPortionModal').classList.remove('hidden');
        }

function resetAllBudgetTargets() {
    showConfirm("รีเซ็ตงบประมาณเดือนนี้?", "ทุกหมวดหมู่ในเดือนนี้จะกลับไปว่างเปล่า", () => {
        const key = getMonthKey();
        
        if (categoryTargets[key]) {
            [...customCategories.spending, ...customCategories.investment].forEach(c => {
                delete categoryTargets[key][c.id];
            });
        }
        

        
        localStorage.setItem('fin_targets_v5', JSON.stringify(categoryTargets));
        hideConfirm();
        
        if (!document.getElementById('settingsModal').classList.contains('hidden')) {
            toggleSettingsModal();
        }
        
        switchPage('overview');
        
        setTimeout(() => {
            updateBudgetUI(); 
            showToast("✅ รีเซ็ตงบประมาณเดือนนี้ว่างเปล่าสำเร็จ");
        }, 300);
    });
}

        function closePortionModal() { document.getElementById('budgetPortionModal').classList.add('hidden'); }

async function clearRecentCache() {
    try {
        console.log('🗑️ Clearing recent cache...');
        
        // ลบ cache เก่า
        localStorage.removeItem('fin_cache_recent');
        
        // โหลด cache ใหม่ (optional)
        if (financeDB && financeDB.loadRecentToCache) {
            await financeDB.loadRecentToCache();
            console.log('✅ Recent cache reloaded');
        } else {
            console.log('✅ Recent cache cleared');
        }
        
    } catch (error) {
        console.warn('Failed to clear recent cache:', error);
    }
}

function savePortion() {
    const k = getMonthKey(); 
    const v = parseFloat(document.getElementById('targetAmountInput').value) || 0;
    
    if (!categoryTargets[k]) categoryTargets[k] = {}; 
    
    categoryTargets[k][editingCatId] = { 
        value: v,
        mode: budgetMode 
    };
    
    localStorage.setItem('fin_targets_v5', JSON.stringify(categoryTargets)); 

    if (isLoggedIn && navigator.onLine) {
        saveBudgetsToBackend();
    }

    updateBudgetUI(); 
    closePortionModal();
}
function showConfirm(t, d, onC) { 
    document.getElementById('confirmTitle').innerText = t; 
    document.getElementById('confirmDesc').innerText = d; 
    document.getElementById('confirmModal').classList.remove('hidden'); 
    
    // ✅ เก็บ callback และปิด modal หลังจาก callback ทำงานเสร็จ
    document.getElementById('confirmBtn').onclick = async function() {
        // เรียก callback (อาจเป็น async)
        await onC();
        // ปิด modal หลังจาก callback เสร็จ
        hideConfirm();
    };
}

function hideConfirm() { 
    document.getElementById('confirmModal').classList.add('hidden'); 
    // ✅ ลบ onclick เพื่อป้องกันการเรียกซ้ำ
    document.getElementById('confirmBtn').onclick = null;
}

function updatePortionModalUnit(mode) {
    const unitElement = document.getElementById('targetUnit');
    const hintElement = document.getElementById('modalHint');
    
    if (!unitElement || !hintElement) return;
    
    unitElement.textContent = mode === 'percentage' ? '%' : '฿';
    
    const c = [...customCategories.spending, ...customCategories.investment].find(x => x.id === editingCatId);
    const isInvestment = c && customCategories.investment.some(inv => inv.id === c.id);
    
    hintElement.textContent = mode === 'percentage' 
        ? (isInvestment ? "% จากงบลงทุน" : "% จากรายได้")
        : "จำนวนเงินคงที่ (บาท)";
}

function showToast(message) {
    const toast = document.getElementById('toast');
    
    if (message.includes("🔄")) {
        toast.classList.remove('green-toast');
        toast.classList.add('bg-blue-500', 'text-white');
    } else if (message.includes("✅")) {
        toast.classList.remove('bg-blue-500');
        toast.classList.add('green-toast');
    } else {
        toast.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl text-[10px] font-bold z-[300]';
    }
    
    toast.innerText = message;
    toast.style.display = 'block';
    toast.style.opacity = '1';
    
    setTimeout(() => { 
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 300);
    }, 2000);
}
        function initIconGrid() { document.getElementById('iconGrid').innerHTML = emojiLib.map(e => `<div class="icon-item p-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-xl flex items-center justify-center" onclick="selectIcon(this, '${e}')">${e}</div>`).join(''); }
        function populateYearSelect() { const s = document.getElementById('yearSelect'); const cur = new Date().getFullYear(); s.innerHTML = Array.from({length:11}, (_,i) => cur-5+i).map(y => `<option value="${y}" ${y===displayYear?'selected':''}>${y}</option>`).join(''); }
        function jumpToYear(y) { displayYear = parseInt(y); updateYearlyUI(); if (document.getElementById('y-tab-tags').classList.contains('active')) updateYearlyTagsUI(); }
        function changeDisplayYear(step) { displayYear += step; document.getElementById('yearSelect').value = displayYear; updateYearlyUI(); if (document.getElementById('y-tab-tags').classList.contains('active')) updateYearlyTagsUI(); }
        function setDefaultDate() {
    if (!editingTxId) {
        document.getElementById('transDate').value = new Date().toISOString().split('T')[0];
    }
}
        function updateTagSuggestions() {
            const cat = document.getElementById('category').value; if (!cat) return;
            const tags = [...new Set(transactions.filter(t => t.category === cat && t.tag).map(t => t.tag.trim()))].slice(0, 15);
            document.getElementById('tagSuggestions').innerHTML = tags.map(t => `<span onclick="document.getElementById('tagInput').value='${t}'" class="px-2 py-0.5 bg-indigo-50 text-indigo-500 border border-indigo-100 rounded-md text-[9px] font-bold dark:bg-indigo-900/40 cursor-pointer">${t}</span>`).join('');
        }
async function exportFullData() { 
    try {
        console.log("📤 เริ่ม export ข้อมูลเต็มรูปแบบ...");
        
        let allTransactions = transactions;
        if (financeDB && financeDB.getAllTransactions) {
            try {
                allTransactions = await financeDB.getAllTransactions();
                console.log(`✅ โหลด ${allTransactions.length} รายการจาก IndexedDB`);
            } catch (dbError) {
                console.warn("⚠️ โหลดจาก IndexedDB ไม่สำเร็จ, ใช้ข้อมูลใน memory แทน:", dbError);
            }
        }
        
        let allAccounts = accounts;
        if (financeDB && financeDB.getFromIndexedDB) {
            try {
                const accountsDoc = await financeDB.getFromIndexedDB('accounts', 'user_accounts');
                if (accountsDoc && accountsDoc.data) {
                    allAccounts = accountsDoc.data;
                    console.log(`✅ โหลด ${allAccounts.length} บัญชีจาก IndexedDB`);
                }
            } catch (accountsError) {
                console.warn("⚠️ โหลดบัญชีจาก IndexedDB ไม่สำเร็จ:", accountsError);
            }
        }
        
        const exportData = {
            version: "3.0",
            exportedAt: new Date().toISOString(),
            appName: "Flow Wallet",
            dataSource: financeDB && financeDB.db ? "IndexedDB + LocalStorage" : "LocalStorage only",
            
            transactions: allTransactions,
            accounts: allAccounts,
            customCategories: customCategories,
            categoryTargets: categoryTargets,
            
            debts: debts,
            payments: payments,
            
            settings: {
                currentAccountId: currentAccountId,
                accountFilterId: accountFilterId,
                currentFontSize: currentFontSize,
                budgetMode: budgetMode,
                darkMode: document.body.classList.contains('dark')
            },
            
            statistics: {
                totalTransactions: allTransactions.length,
                totalAccounts: allAccounts.length,
                totalDebts: debts.length,
                totalPayments: payments.length,
                exportDate: new Date().toLocaleDateString('th-TH')
            }
        };
        
        const jsonString = JSON.stringify(exportData, null, 2); 
        const blob = new Blob([jsonString], {type: "application/json"});
        
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url;
        
        const date = new Date();
        const timestamp = `${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}_${date.getHours().toString().padStart(2,'0')}${date.getMinutes().toString().padStart(2,'0')}`;
        link.download = `FlowWallet_Full_Backup_${timestamp}.json`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => URL.revokeObjectURL(url), 100);
        
        const fileSize = (blob.size / 1024).toFixed(2);
        const summary = `
✅ Export สำเร็จ!
• ธุรกรรม: ${allTransactions.length} รายการ
• บัญชี: ${allAccounts.length} บัญชี
• หนี้: ${debts.length} รายการ
• การชำระ: ${payments.length} รายการ
• ขนาดไฟล์: ${fileSize} KB
        `;
        
        showToast(summary);
        console.log("📊 Export Summary:", exportData.statistics);
        
    } catch (error) {
        console.error("❌ Export ล้มเหลว:", error);
        showToast("❌ Export ไม่สำเร็จ: " + error.message);
    }
}
function openMobileImportModal() {
    if (isMobile()) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,.JSON';
        input.style.display = 'none';
        
        input.onchange = async function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            showToast("📥 กำลังนำเข้าไฟล์...");
            
            try {
                const text = await file.text();
                const data = JSON.parse(text);
                
                await importFullData(data);
                
                document.body.removeChild(input);
                
            } catch (error) {
                console.error("❌ Import ล้มเหลว:", error);
                showToast("❌ นำเข้าไม่สำเร็จ: " + error.message);
            }
        };
        
        document.body.appendChild(input);
        input.click();
        
    } else {
        document.getElementById('restoreFileInput').click();
    }
}

async function importFullData(data) {
    try {
        console.log("📥 เริ่ม import ข้อมูล...", data);
        
        if (!data.version) {
            showToast("⚠️ ไฟล์เก่าเกินไป, ใช้วิธี import แบบเก่า");
            return importLegacyData(data);
        }
        
        showToast("🔄 กำลังนำเข้าข้อมูล...");
        
        let importedCount = 0;
        let errorCount = 0;
        
        if (data.accounts && Array.isArray(data.accounts)) {
            console.log(`📥 นำเข้าบัญชี ${data.accounts.length} บัญชี`);
            
            data.accounts.forEach(newAccount => {
                const exists = accounts.some(acc => acc.id === newAccount.id);
                if (!exists) {
                    accounts.push(newAccount);
                    importedCount++;
                }
            });
            
            saveAccounts();
            showToast(`✅ นำเข้าบัญชี ${data.accounts.length} บัญชี`);
        }
        await clearRecentCache();
        if (data.customCategories) {
            customCategories = data.customCategories;
            localStorage.setItem('fin_custom_cats', JSON.stringify(customCategories));
            console.log("✅ นำเข้าหมวดหมู่");
        }
        
        if (data.categoryTargets) {
            categoryTargets = data.categoryTargets;
            localStorage.setItem('fin_targets_v5', JSON.stringify(categoryTargets));
            console.log("✅ นำเข้าเป้าหมายงบประมาณ");
        }
        
        if (data.transactions && Array.isArray(data.transactions)) {
            console.log(`📥 นำเข้า ${data.transactions.length} ธุรกรรม`);
            
            for (let i = 0; i < data.transactions.length; i++) {
                const tx = data.transactions[i];
                
                try {
                    if (!tx.id || !tx.amount || !tx.type || !tx.rawDate) {
                        console.warn("⚠️ ธุรกรรมไม่สมบูรณ์:", tx);
                        errorCount++;
                        continue;
                    }
                    
                    const result = await financeDB.saveTransaction(tx);
                    
                    if (result.success) {
                        importedCount++;
                        
                        if (isMobile() && i % 10 === 0) {
                            const percent = Math.round((i / data.transactions.length) * 100);
                            showToast(`กำลังนำเข้า... ${percent}%`);
                        }
                    } else {
                        errorCount++;
                    }
                    
                } catch (txError) {
                    console.error("❌ ข้อผิดพลาดธุรกรรม:", txError);
                    errorCount++;
                }
            }
            
            console.log(`✅ นำเข้า ${importedCount} ธุรกรรม, ${errorCount} ข้อผิดพลาด`);
        }
        
        if (data.debts && Array.isArray(data.debts)) {
            debts = data.debts;
            localStorage.setItem('fin_debts', JSON.stringify(debts));
            console.log(`✅ นำเข้า ${debts.length} หนี้`);
        }
        
        if (data.payments && Array.isArray(data.payments)) {
            payments = data.payments;
            localStorage.setItem('fin_debt_payments', JSON.stringify(payments));
            console.log(`✅ นำเข้า ${payments.length} การชำระ`);
        }
        
        if (data.settings) {
            if (data.settings.currentAccountId) {
                currentAccountId = data.settings.currentAccountId;
                localStorage.setItem('fin_current_account', currentAccountId);
            }
            
            if (data.settings.currentFontSize) {
                currentFontSize = data.settings.currentFontSize;
                localStorage.setItem('fin_fontsize', currentFontSize);
                setFontSize(currentFontSize, false);
            }
            
            if (data.settings.budgetMode) {
                budgetMode = data.settings.budgetMode;
                localStorage.setItem('fin_budget_mode', budgetMode);
            }
            
            console.log("✅ นำเข้าการตั้งค่า");
        }
        
        setTimeout(() => {
            loadInitialData();
            
            updateUI();
            updateCategorySelect();
            updateAccountSelect();
            updateAccountFilterDropdown();
            
            refreshAnalysisCharts();
            
            if (!document.getElementById('page-accounts').classList.contains('hidden')) {
                renderAccountsList();
            }
            if (!document.getElementById('page-debt').classList.contains('hidden')) {
                renderDebtPage();
            }
            
            const summary = `
✅ Import สำเร็จ!
• ธุรกรรม: ${importedCount} รายการ
• บัญชี: ${data.accounts?.length || 0} บัญชี
• หนี้: ${data.debts?.length || 0} รายการ
• ข้อผิดพลาด: ${errorCount} รายการ
            `;
            
            showToast(summary);
            
            if (isMobile()) {
                switchPage('overview');
            }
            
        }, 1000);
        
    } catch (error) {
        console.error("❌ Import ล้มเหลว:", error);
        showToast("❌ นำเข้าไม่สำเร็จ: " + error.message);
    }
}

function importLegacyData(data) {
    console.log("🔄 นำเข้าไฟล์รูปแบบเก่า");
    
    transactions = data.transactions || [];
    categoryTargets = data.targets || {};
    customCategories = data.cats || defaultCategories;
    
    localStorage.setItem('fin_tx_v5', JSON.stringify(transactions.slice(0, 1000)));
    localStorage.setItem('fin_targets_v5', JSON.stringify(categoryTargets));
    localStorage.setItem('fin_custom_cats', JSON.stringify(customCategories));
    
    updateUI();
    updateCategorySelect();
    
    showToast("✅ นำเข้าข้อมูลสำเร็จ (ไฟล์รูปแบบเก่า)");
}

async function resetAllData() {
    showConfirm("รีเซ็ตข้อมูลทั้งหมด?", "ข้อมูลทั้งหมดจะถูกลบและไม่สามารถกู้คืนได้", async () => {
        try {
            console.log("🔄 เริ่มต้นรีเซ็ตข้อมูลทั้งหมด...");
            
            transactions = [];
            categoryTargets = {};
            customCategories = JSON.parse(JSON.stringify(defaultCategories));
            currentDate = new Date();
            currentFontSize = 'medium';
            editingTxId = null;
            editingCatId = null;
            editingTagName = null;
            selectedIcon = '📁';
            analysisDate = new Date(); 
            displayYear = new Date().getFullYear(); 
            analysisPeriod = 'month'; 
            
            if (financeDB && financeDB.db) {
                try {
                    console.log("🗑️ ลบข้อมูลจาก IndexedDB...");
                    
                    const storeNames = ['transactions', 'categories', 'budgets', 'metadata'];
                    for (const storeName of storeNames) {
                        const transaction = financeDB.db.transaction([storeName], 'readwrite');
                        const store = transaction.objectStore(storeName);
                        await new Promise((resolve, reject) => {
                            const request = store.clear();
                            request.onsuccess = () => resolve();
                            request.onerror = () => reject(request.error);
                        });
                    }
                    console.log("✅ ลบข้อมูลจาก IndexedDB สำเร็จ");
                } catch (dbError) {
                    console.error("❌ ลบ IndexedDB ไม่สำเร็จ:", dbError);
                }
            }
            
            console.log("🗑️ ลบข้อมูลจาก LocalStorage...");
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('fin_') || 
                    key.startsWith('finance_') || 
                    key.startsWith('fin_cache_') ||
                    key.includes('current_view')) {
                    keysToRemove.push(key);
                }
            }
            
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
            });
            
            console.log(`✅ ลบข้อมูลจาก LocalStorage สำเร็จ: ${keysToRemove.length} รายการ`);
            
            sessionStorage.clear(); 
            
            if (financeDB && financeDB.removeFromInMemoryTransactions) {
                financeDB.removeFromInMemoryTransactions = () => {}; 
            }
            
            updateMonthDisplay();
            updateCategorySelect();
            setDefaultDate();
            setFontSize('medium', false);
            
            const currentPage = getCurrentPage();
            
            setTimeout(() => {
                updateUI();
                renderCalendar();
                
                if (currentPage === 'budget') {
                    updateBudgetUI();
                } else if (currentPage === 'analysis') {
                    updateAnalysisPeriodText();
                    refreshAnalysisCharts();
                } else if (currentPage === 'yearly') {
                    updateYearlyUI();
                }
                
                populateYearSelect();
                
                hideConfirm();
                if (!document.getElementById('settingsModal').classList.contains('hidden')) {
                    toggleSettingsModal();
                }
                
                showToast("✅ รีเซ็ตข้อมูลทั้งหมดสำเร็จ! ระบบพร้อมใช้งานใหม่");
                console.log("🎉 รีเซ็ตข้อมูลเสร็จสมบูรณ์");
            }, 500);
            
        } catch (error) {
            console.error('❌ Error resetting data:', error);
            hideConfirm();
            showToast("❌ รีเซ็ตไม่สำเร็จ: " + error.message);
            
            console.error("Debug info:", {
                financeDBReady: !!(financeDB && financeDB.db),
                localStorageKeys: Array.from({length: localStorage.length}, (_, i) => localStorage.key(i)),
                memoryTransactionsCount: transactions.length
            });
        }
    });
}

async function saveCurrentView() {
    try {
        console.log('💾 กำลังบันทึกหน้าต่างปัจจุบัน...');
        
        const currentView = {
            page: getCurrentPage(),
            month: currentDate.getMonth(),
            year: currentDate.getFullYear(),
            fontSize: currentFontSize,
            darkMode: document.body.classList.contains('dark'),
            analysisPeriod: analysisPeriod,
            analysisDate: analysisDate.toISOString(),
            displayYear: displayYear,
            overviewTab: document.querySelector('#tab-history-btn.text-indigo-600, #tab-history-btn.text-indigo-400, #tab-history-btn.border-indigo-600') ? 'history' : 'calendar',
            analysisTab: document.querySelector('.analysis-tab-btn.active')?.id?.replace('a-tab-', '') || 'overview',
            yearlyTab: document.querySelector('.yearly-tab-btn.active')?.id?.replace('y-tab-', '') || 'category',
            savedAt: new Date().toISOString(),
            version: '2.0'
        };
        
        console.log('📋 ข้อมูลที่จะบันทึก:', currentView);
        
        let savedToIndexedDB = false;
        let savedToLocalStorage = false;
        
        if (financeDB && financeDB.db) {
            try {
                const transaction = financeDB.db.transaction(['metadata'], 'readwrite');
                const store = transaction.objectStore('metadata');
                
                const saveData = {
                    key: 'current_view',
                    value: currentView,
                    updatedAt: new Date().toISOString()
                };
                
                await new Promise((resolve, reject) => {
                    const request = store.put(saveData);
                    request.onsuccess = () => {
                        savedToIndexedDB = true;
                        console.log('✅ บันทึกใน IndexedDB สำเร็จ');
                        resolve();
                    };
                    request.onerror = (event) => {
                        console.warn('⚠️ บันทึกใน IndexedDB ไม่สำเร็จ:', event.target.error);
                        reject(event.target.error);
                    };
                });
                
            } catch (dbError) {
                console.warn('⚠️ FinanceDB save error:', dbError);
            }
        }
        
        try {
            localStorage.setItem('fin_current_view', JSON.stringify(currentView));
            savedToLocalStorage = true;
            console.log('✅ บันทึกใน LocalStorage สำเร็จ');
        } catch (lsError) {
            console.error('❌ LocalStorage error:', lsError);
        }
        
        let message;
        if (savedToIndexedDB && savedToLocalStorage) {
            message = "💾 บันทึกใน IndexedDB + LocalStorage สำเร็จ";
        } else if (savedToLocalStorage) {
            message = "💾 บันทึกใน LocalStorage สำเร็จ (IndexedDB ไม่พร้อม)";
        } else {
            message = "❌ บันทึกไม่สำเร็จ";
        }
        
        showToast(message);
        console.log('🎉 บันทึกเสร็จสิ้น:', { savedToIndexedDB, savedToLocalStorage });
        
        if (isMobile()) {
                    switchPage('overview');
                    showToast("✅ บันทึกสำเร็จ! กลับไปหน้าหลัก");
                }

    } catch (error) {
        console.error('❌ เกิดข้อผิดพลาดในการบันทึก:', error);
        showToast("❌ บันทึกไม่สำเร็จ: " + error.message);
    }
}

function getCurrentPage() {
    if (!document.getElementById('page-overview').classList.contains('hidden')) return 'overview';
    if (!document.getElementById('page-budget').classList.contains('hidden')) return 'budget';
    if (!document.getElementById('page-analysis').classList.contains('hidden')) return 'analysis';
    if (!document.getElementById('page-yearly').classList.contains('hidden')) return 'yearly';
    return 'overview';
}

async function loadSavedView() {
    try {
        console.log('🔄 กำลังโหลดหน้าต่างที่บันทึกไว้...');
        
        let savedView = null;
        let source = 'none';
        
        
        if (financeDB && financeDB.db) {
            try {
                const transaction = financeDB.db.transaction(['metadata'], 'readonly');
                const store = transaction.objectStore('metadata');
                const request = store.get('current_view');
                
                const result = await new Promise((resolve, reject) => {
                    request.onsuccess = (event) => resolve(event.target.result);
                    request.onerror = reject;
                });
                
                if (result && result.value) {
                    savedView = result.value;
                    source = 'IndexedDB (metadata store)';
                    console.log(`✅ โหลดจาก ${source}`);
                }
            } catch (indexedDBError) {
                console.warn('⚠️ โหลดจาก IndexedDB ไม่สำเร็จ:', indexedDBError);
            }
        }
        
        if (!savedView && financeDB && financeDB.getMetadata) {
            try {
                const view = await financeDB.getMetadata('current_view');
                if (view) {
                    savedView = view;
                    source = 'FinanceDB metadata';
                    console.log(`✅ โหลดจาก ${source}`);
                }
            } catch (metaError) {
                console.warn('⚠️ โหลดจาก FinanceDB metadata ไม่สำเร็จ:', metaError);
            }
        }
        
        if (!savedView) {
            try {
                const localStorageView = JSON.parse(localStorage.getItem('fin_current_view'));
                if (localStorageView) {
                    savedView = localStorageView;
                    source = 'LocalStorage';
                    console.log(`✅ โหลดจาก ${source}`);
                }
            } catch (lsError) {
                console.warn('⚠️ โหลดจาก LocalStorage ไม่สำเร็จ:', lsError);
            }
        }
        
        if (!savedView) {
            try {
                const fallbackView = JSON.parse(localStorage.getItem('fin_current_view_indexeddb_fallback'));
                if (fallbackView) {
                    savedView = fallbackView;
                    source = 'LocalStorage fallback';
                    console.log(`✅ โหลดจาก ${source}`);
                }
            } catch (fallbackError) {
                console.warn('⚠️ โหลดจาก fallback ไม่สำเร็จ:', fallbackError);
            }
        }
        
        if (savedView) {
            console.log(`📊 โหลดสำเร็จจาก: ${source}`);
            console.log('📋 ข้อมูลที่โหลดได้:', savedView);
            applySavedView(savedView);
        } else {
            console.log('ℹ️ ไม่พบข้อมูลหน้าต่างที่บันทึกไว้');
        }
        
    } catch (error) {
        console.error('❌ Error loading saved view:', error);
    }
}


        function triggerRestore() { document.getElementById('restoreFileInput').click(); }
 async function handleRestoreFile(input) { 
    const file = input.files[0]; 
    if (!file) return;
    
    showToast("📥 กำลังนำเข้าไฟล์...");
    
    try {
        const reader = new FileReader();
        
        reader.onload = async (event) => {
            try {
                let fileContent = event.target.result;
                
                try {
                    fileContent = autoFixJSON(fileContent);
                } catch (fixError) {
                    console.error("❌ ไม่สามารถซ่อม JSON ได้:", fixError);
                    
                    const preview = event.target.result.substring(0, 200);
                    showToast(`❌ ไฟล์ไม่ใช่ JSON ที่ถูกต้อง (ขึ้นต้นด้วย "${preview.substring(0, 20)}")`, 'error');
                    
                    if (confirm('ต้องการดูเนื้อหาไฟล์ใน Console เพื่อ debug หรือไม่?')) {
                        console.log("========== เนื้อหาไฟล์ ==========");
                        console.log(event.target.result);
                        console.log("=================================");
                    }
                    
                    input.value = '';
                    return;
                }
                
                const data = JSON.parse(fileContent);
                
                console.log("📋 ข้อมูลที่นำเข้า:", data);
                
                if (data.version) {
                    await importVersionedData(data);
                } else {
                    await importLegacyJSON(data);
                }
                
                input.value = '';
                
            } catch (parseError) {
                console.error("❌ ไฟล์ไม่ถูกต้อง:", parseError);
                
                showToast(`❌ JSON ไม่ถูกต้อง: ${parseError.message}`, 'error');
                
                if (confirm('ต้องการดูเนื้อหาไฟล์ใน Console เพื่อ debug หรือไม่?')) {
                    console.log("========== เนื้อหาไฟล์ ==========");
                    console.log(event.target.result);
                    console.log("=================================");
                }
                
                input.value = '';
            }
        };
        
        reader.readAsText(file, 'UTF-8');
        
    } catch (error) {
        console.error("❌ ข้อผิดพลาดนำเข้า:", error);
        showToast("❌ นำเข้าไม่สำเร็จ: " + error.message, 'error');
        input.value = '';
    }
}

function debugJSONFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.JSON';
    input.style.display = 'none';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        
        reader.onload = function(event) {
            const content = event.target.result;
            
            console.log("========== DEBUG JSON FILE ==========");
            console.log("ชื่อไฟล์:", file.name);
            console.log("ขนาดไฟล์:", file.size, "bytes");
            console.log("ประเภทไฟล์:", file.type);
            
            console.log("เนื้อหาทั้งหมด:");
            console.log(content);
            
            console.log("\nรหัส ASCII 20 ตัวแรก:");
            for (let i = 0; i < Math.min(20, content.length); i++) {
                console.log(`[${i}] '${content[i]}' = ${content.charCodeAt(i)}`);
            }
            
            if (content.charCodeAt(0) === 0xFEFF) {
                console.log("✅ พบ BOM (Byte Order Mark) ที่ตำแหน่ง 0");
            } else {
                console.log("❌ ไม่พบ BOM");
            }
            
            const trimmed = content.trim();
            console.log("\nหลังจาก trim():", trimmed.substring(0, 100));
            console.log("ขึ้นต้นด้วย:", trimmed.substring(0, 20));
            
            alert("✅ ตรวจสอบ JSON เสร็จสิ้น ดูใน Console (F12)");
            
            document.body.removeChild(input);
        };
        
        reader.readAsText(file, 'UTF-8');
    };
    
    document.body.appendChild(input);
    input.click();
}

function autoFixJSON(content) {
    console.log("🔧 พยายามซ่อม JSON อัตโนมัติ...");
    
    let fixed = content;
    
    if (fixed.charCodeAt(0) === 0xFEFF) {
        fixed = fixed.slice(1);
        console.log("✅ ลบ BOM แล้ว");
    }
    
    fixed = fixed.trim();
    
    const firstBrace = fixed.indexOf('{');
    const firstBracket = fixed.indexOf('[');
    
    if (firstBrace > 0 || firstBracket > 0) {
        if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
            console.log(`⚠️ พบอักขระด้านหน้าก่อน { จำนวน ${firstBrace} ตัว, กำลังลบ...`);
            fixed = fixed.substring(firstBrace);
        } else if (firstBracket !== -1) {
            console.log(`⚠️ พบอักขระด้านหน้าก่อน [ จำนวน ${firstBracket} ตัว, กำลังลบ...`);
            fixed = fixed.substring(firstBracket);
        }
    }
    
    if (!fixed.startsWith('{') && !fixed.startsWith('[')) {
        throw new Error('ไม่พบ JSON ในไฟล์');
    }
    
    return fixed;
}

async function importLegacyJSON(oldData) {
    console.log("🔄 เริ่มแปลง JSON รูปแบบเก่า...");
    
    try {
        let importedCount = 0;
        let errorCount = 0;
        
        let oldTransactions = [];
        
        if (oldData.data && oldData.data.transactions) {
            oldTransactions = oldData.data.transactions;
        }
        
        else if (oldData.transactions && Array.isArray(oldData.transactions)) {
            oldTransactions = oldData.transactions;
        }
       
        else if (Array.isArray(oldData)) {
            oldTransactions = oldData;
        }
        
        console.log(`📦 พบ ${oldTransactions.length} transactions ในไฟล์เก่า`);
        
        for (let i = 0; i < oldTransactions.length; i++) {
            try {
                const oldTx = oldTransactions[i];
                const newTx = convertLegacyTransaction(oldTx);
                
                if (newTx) {
                    const result = await financeDB.saveTransaction(newTx);
                    
                    if (result.success) {
                        importedCount++;
                        
                        const exists = transactions.some(t => t.id === newTx.id);
                        if (!exists) {
                            transactions.unshift(newTx);
                        }
                    } else {
                        errorCount++;
                    }
                } else {
                    errorCount++;
                }
                
                if (i % 10 === 0) {
                    const percent = Math.round((i / oldTransactions.length) * 100);
                    showToast(`🔄 กำลังแปลง... ${percent}%`);
                }
                
            } catch (txError) {
                console.error("❌ แปลง transaction ไม่สำเร็จ:", txError);
                errorCount++;
            }
        }
        
        if (oldData.categories || (oldData.data && oldData.data.categories)) {
            const oldCats = oldData.categories || oldData.data.categories;
            if (oldCats) {
                customCategories = mergeCategories(customCategories, oldCats);
                localStorage.setItem('fin_custom_cats', JSON.stringify(customCategories));
                console.log("✅ นำเข้าหมวดหมู่แล้ว");
            }
        }
        
        if (oldData.budgets || (oldData.data && oldData.data.budgets)) {
            const oldBudgets = oldData.budgets || oldData.data.budgets;
            if (oldBudgets) {
                categoryTargets = { ...categoryTargets, ...oldBudgets };
                localStorage.setItem('fin_targets_v5', JSON.stringify(categoryTargets));
                console.log("✅ นำเข้างบประมาณแล้ว");
            }
        }
        
        if (oldData.accounts || (oldData.data && oldData.data.accounts)) {
            const oldAccounts = oldData.accounts || oldData.data.accounts;
            if (oldAccounts && Array.isArray(oldAccounts)) {
                for (const acc of oldAccounts) {
                    const exists = accounts.some(a => a.id === acc.id);
                    if (!exists) {
                        accounts.push(acc);
                    }
                }
                saveAccounts();
                console.log(`✅ นำเข้า ${oldAccounts.length} บัญชี`);
            }
        }
        
        showToast(`✅ แปลงข้อมูลสำเร็จ! นำเข้า ${importedCount} รายการ, ผิดพลาด ${errorCount} รายการ`, 'success');
        
        setTimeout(() => {
            loadInitialData();
            updateUI();
            updateAccountSelect();
            updateAccountFilterDropdown();
            
            if (!document.getElementById('page-accounts').classList.contains('hidden')) {
                renderAccountsList();
            }
            
            if (isMobile()) {
                switchPage('overview');
            }
        }, 1000);
        
    } catch (error) {
        console.error("❌ แปลง JSON เก่าล้มเหลว:", error);
        showToast("❌ แปลงข้อมูลไม่สำเร็จ: " + error.message, 'error');
    }
}

function convertLegacyTransaction(oldTx) {
    try {
        console.log("🔄 แปลง transaction เก่า:", oldTx);
        
        let id = oldTx.id || oldTx._id || `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        let rawDate = oldTx.rawDate || oldTx.date || oldTx.createdAt || new Date().toISOString().split('T')[0];
        if (rawDate.includes('T')) {
            rawDate = rawDate.split('T')[0]; 
        }
        
        const dateObj = new Date(rawDate);
        const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
        
        let accountId = oldTx.accountId || oldTx.account_id || null;
        if (accountId && typeof accountId === 'number') {
            accountId = accountId.toString(); 
        }
        
        if (!accountId) {
            const defaultAccount = accounts.find(a => a.isDefault);
            accountId = defaultAccount ? defaultAccount.id : 'default_acc';
        }
        
        const owner_type = isLoggedIn ? 'user' : 'guest';
        const owner_id = isLoggedIn ? currentUser.id : getGuestId();
        
        const newTx = {
            id: id,
            amount: oldTx.amount || 0,
            type: oldTx.type || 'expense',
            category: oldTx.category || 'อื่นๆ',
            icon: oldTx.icon || '📝',
            desc: oldTx.desc || oldTx.description || oldTx.category || '',
            tag: oldTx.tag || '',
            rawDate: rawDate,
            monthKey: monthKey,
            date: rawDate,
            accountId: accountId,
            createdAt: oldTx.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            
            owner_type: owner_type,
            owner_id: owner_id,
            
            imported: true,
            originalFormat: 'legacy'
        };
        
        console.log("✅ แปลงสำเร็จ:", newTx);
        return newTx;
        
    } catch (error) {
        console.error("❌ แปลงไม่สำเร็จ:", error, oldTx);
        return null;
    }
}

function mergeCategories(existingCats, oldCats) {
    console.log("🔄 รวมหมวดหมู่เก่าและใหม่...");
    
    const result = {
        income: [...existingCats.income],
        spending: [...existingCats.spending],
        investment: [...existingCats.investment]
    };
    
    if (Array.isArray(oldCats)) {
        oldCats.forEach(cat => {
            const catName = cat.label || cat.name || cat;
            
            const exists = [...result.income, ...result.spending, ...result.investment]
                .some(c => c.label === catName || c.id === cat.id);
            
            if (!exists && catName) {
                result.spending.push({
                    id: cat.id || `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    label: catName,
                    icon: cat.icon || '📝',
                    default: null
                });
            }
        });
    }
    
    if (oldCats.income && Array.isArray(oldCats.income)) {
        oldCats.income.forEach(cat => {
            const exists = result.income.some(c => c.label === cat.label || c.id === cat.id);
            if (!exists) {
                result.income.push(cat);
            }
        });
    }
    
    if (oldCats.spending && Array.isArray(oldCats.spending)) {
        oldCats.spending.forEach(cat => {
            const exists = result.spending.some(c => c.label === cat.label || c.id === cat.id);
            if (!exists) {
                result.spending.push(cat);
            }
        });
    }
    
    if (oldCats.investment && Array.isArray(oldCats.investment)) {
        oldCats.investment.forEach(cat => {
            const exists = result.investment.some(c => c.label === cat.label || c.id === cat.id);
            if (!exists) {
                result.investment.push(cat);
            }
        });
    }
    
    console.log("✅ รวมหมวดหมู่เสร็จสิ้น");
    return result;
}

function analyzeJSONFile(fileContent) {
    console.log("🔍 วิเคราะห์ไฟล์ JSON...");
    
    try {
        const data = JSON.parse(fileContent);
        
        console.log("📊 โครงสร้างไฟล์:", {
            hasVersion: !!data.version,
            isArray: Array.isArray(data),
            keys: Object.keys(data),
            dataKeys: data.data ? Object.keys(data.data) : null,
            transactionCount: data.transactions?.length || data.data?.transactions?.length || 0
        });
        
        if (data.transactions && data.transactions.length > 0) {
            const sample = data.transactions[0];
            console.log("📝 ตัวอย่าง transaction:", {
                id: sample.id,
                hasRawDate: !!sample.rawDate,
                hasDate: !!sample.date,
                hasAccountId: !!sample.accountId,
                accountIdType: typeof sample.accountId,
                keys: Object.keys(sample)
            });
        }
        
        showToast("✅ วิเคราะห์ไฟล์เสร็จสิ้น ดูใน Console", 'info');
        
    } catch (error) {
        console.error("❌ วิเคราะห์ไม่สำเร็จ:", error);
        showToast("❌ ไฟล์ไม่ใช่ JSON ที่ถูกต้อง", 'error');
    }
}

async function importVersionedData(data) {
    try {
        console.log("🔄 นำเข้าไฟล์เวอร์ชัน:", data.version);
        
        let importedCount = 0;
        let errorCount = 0;
        
        if (!data.data && !data.transactions) {
            throw new Error("โครงสร้างไฟล์ไม่ถูกต้อง");
        }
        
        const sourceData = data.data || data;
        
        if (sourceData.accounts && Array.isArray(sourceData.accounts)) {
            console.log(`📥 นำเข้าบัญชี ${sourceData.accounts.length} บัญชี`);
            
            sourceData.accounts.forEach(newAccount => {
                const exists = accounts.some(acc => acc.id === newAccount.id);
                if (!exists) {
                    accounts.push(newAccount);
                }
            });
            
            saveAccounts();
            showToast(`✅ นำเข้าบัญชี ${sourceData.accounts.length} บัญชี`);
        }
        
        if (sourceData.categories || sourceData.customCategories) {
            const categories = sourceData.categories || sourceData.customCategories;
            customCategories = categories;
            localStorage.setItem('fin_custom_cats', JSON.stringify(customCategories));
            console.log("✅ นำเข้าหมวดหมู่");
        }
        
        if (sourceData.budgets || sourceData.categoryTargets) {
            const budgets = sourceData.budgets || sourceData.categoryTargets;
            categoryTargets = budgets;
            localStorage.setItem('fin_targets_v5', JSON.stringify(categoryTargets));
            console.log("✅ นำเข้าเป้าหมายงบประมาณ");
        }
        
        const transactionsToImport = sourceData.transactions || [];
        if (transactionsToImport.length > 0) {
            console.log(`📥 นำเข้า ${transactionsToImport.length} ธุรกรรม`);
            
            for (let i = 0; i < transactionsToImport.length; i++) {
                const tx = transactionsToImport[i];
                
                try {
                    if (!tx.id || !tx.amount || !tx.type) {
                        console.warn("⚠️ ธุรกรรมไม่สมบูรณ์:", tx);
                        errorCount++;
                        continue;
                    }
                    
                    if (!tx.monthKey && tx.rawDate) {
                        const date = new Date(tx.rawDate);
                        tx.monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    }
                    
                    if (financeDB && financeDB.saveTransaction) {
                        const result = await financeDB.saveTransaction(tx);
                        if (result.success) {
                            importedCount++;
                            
                            if (i % 50 === 0) {
                                const percent = Math.round((i / transactionsToImport.length) * 100);
                                showToast(`กำลังนำเข้า... ${percent}%`);
                            }
                        } else {
                            errorCount++;
                        }
                    } else {
                        const exists = transactions.some(t => t.id === tx.id);
                        if (!exists) {
                            transactions.unshift(tx);
                            importedCount++;
                        }
                    }
                    
                } catch (txError) {
                    console.error("❌ ข้อผิดพลาดธุรกรรม:", txError);
                    errorCount++;
                }
            }
        }
        
        if (sourceData.debts && Array.isArray(sourceData.debts)) {
            debts = sourceData.debts;
            localStorage.setItem('fin_debts', JSON.stringify(debts));
            console.log(`✅ นำเข้า ${debts.length} หนี้`);
        }
        
        if (sourceData.payments && Array.isArray(sourceData.payments)) {
            payments = sourceData.payments;
            localStorage.setItem('fin_debt_payments', JSON.stringify(payments));
            console.log(`✅ นำเข้า ${payments.length} การชำระ`);
        }
        
        if (data.settings || sourceData.settings) {
            const settings = data.settings || sourceData.settings;
            
            if (settings.currentAccountId) {
                currentAccountId = settings.currentAccountId;
                localStorage.setItem('fin_current_account', currentAccountId);
            }
            
            if (settings.currentFontSize) {
                currentFontSize = settings.currentFontSize;
                localStorage.setItem('fin_fontsize', currentFontSize);
                setFontSize(currentFontSize, false);
            }
            
            if (settings.budgetMode) {
                budgetMode = settings.budgetMode;
                localStorage.setItem('fin_budget_mode', budgetMode);
            }
            
            console.log("✅ นำเข้าการตั้งค่า");
        }
        
        if (transactions.length > 0 && !financeDB) {
            localStorage.setItem('fin_tx_v5', JSON.stringify(transactions.slice(0, 1000)));
        }
        
        setTimeout(() => {
            if (financeDB && financeDB.loadInitialData) {
                financeDB.loadInitialData();
            } else {
                loadFromLocalStorageFallback();
            }
            
            updateUI();
            updateCategorySelect();
            updateAccountSelect();
            updateAccountFilterDropdown();
            
            refreshAnalysisCharts();
            
            if (!document.getElementById('page-accounts').classList.contains('hidden')) {
                renderAccountsList();
            }
            if (!document.getElementById('page-debt').classList.contains('hidden')) {
                renderDebtPage();
            }
            
            const summary = `
✅ Import สำเร็จ!
• ธุรกรรม: ${importedCount} รายการ
• บัญชี: ${sourceData.accounts?.length || 0} บัญชี
• หนี้: ${sourceData.debts?.length || 0} รายการ
• ข้อผิดพลาด: ${errorCount} รายการ
            `;
            
            showToast(summary);
            
        }, 1500);
        
    } catch (error) {
        console.error("❌ Import versioned data failed:", error);
        showToast("❌ นำเข้าไม่สำเร็จ: " + error.message);
    }
}

function triggerMobileRestore() {
    if (isMobile()) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,.JSON';
        input.style.display = 'none';
        
        input.onchange = function(e) {
            handleRestoreFile(e.target);
            setTimeout(() => {
                if (input.parentElement) {
                    document.body.removeChild(input);
                }
            }, 1000);
        };
        
        document.body.appendChild(input);
        input.click();
        
    } else {
        triggerRestore();
    }
}
        function renderTagList() {
            const search = document.getElementById('tagSearchInput').value.toLowerCase();
            const allTags = [...new Set(transactions.map(t => t.tag).filter(tag => tag && tag.trim() !== ''))];
            const filtered = allTags.filter(tag => tag.toLowerCase().includes(search)).sort();
            const container = document.getElementById('tagListContainer');
            if (filtered.length === 0) { container.innerHTML = `<div class="p-4 text-center text-slate-400 italic text-[10px]">ไม่พบ TAG</div>`; return; }
            container.innerHTML = filtered.map(tag => `<div class="p-2 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center dark:bg-slate-800/50 dark:border-slate-700"><span class="font-bold text-[11px] dark:text-white"># ${tag}</span><div class="flex gap-1"><button onclick="prepareEditTag('${tag}')" class="p-1 text-indigo-400 text-xs">✎</button><button onclick="deleteTag('${tag}')" class="p-1 text-rose-400 text-xs">✕</button></div></div>`).join('');
        }
        function prepareEditTag(name) { editingTagName = name; document.getElementById('editTagNameInput').value = name; document.getElementById('tagEditForm').classList.remove('hidden'); }
        function saveTagEdit() {
            const newName = document.getElementById('editTagNameInput').value.trim(); if (!newName) return;
            transactions.forEach(t => { if (t.tag === editingTagName) t.tag = newName; });
            localStorage.setItem('fin_tx_v5', JSON.stringify(transactions)); cancelTagEdit(); renderTagList(); updateUI(); showToast("อัปเดต Tag แล้ว");
        }
        function cancelTagEdit() { editingTagName = null; document.getElementById('tagEditForm').classList.add('hidden'); }
        function deleteTag(name) { showConfirm("ลบประวัติ TAG?", `ชื่อ "${name}" จะหายไปจากทุกรายการ`, () => { transactions.forEach(t => { if (t.tag === name) t.tag = ""; }); localStorage.setItem('fin_tx_v5', JSON.stringify(transactions)); renderTagList(); updateUI(); hideConfirm(); showToast("ลบแล้ว"); }); }



let sideMenuOpen = false;

function toggleMobileSideMenu() {
    const sideMenu = document.getElementById('mobileSideMenu');
    const sideMenuPanel = document.getElementById('sideMenuPanel');
    const backdrop = document.getElementById('sideMenuBackdrop');
    
    sideMenuOpen = !sideMenuOpen;
    
    if (sideMenuOpen) {
        sideMenu.classList.remove('hidden');
        
        setTimeout(() => {
            sideMenuPanel.style.transform = 'translateX(0)';
            backdrop.style.opacity = '1';
        }, 10);
        
        document.body.style.overflow = 'hidden';
    } else {
        sideMenuPanel.style.transform = '-translate-x-full';
        backdrop.style.opacity = '0';
        
        setTimeout(() => {
            sideMenu.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

function closeMobileSideMenu() {
    if (sideMenuOpen) {
        toggleMobileSideMenu();
    }
}

function updateAuthButtons() {
    console.log('🔄 Updating auth buttons...');
    
    const user = JSON.parse(localStorage.getItem('user'));
    const isLoggedInUser = !!(user && user.username);
    

    const desktopLoginBtn = document.getElementById('loginButton');
    const desktopLogoutDiv = document.getElementById('logoutButton');
    const usernameSpan = document.getElementById('loggedInUsername');
    
    if (desktopLoginBtn) {
        desktopLoginBtn.classList.toggle('hidden', isLoggedInUser);
    }
    if (desktopLogoutDiv) {
        desktopLogoutDiv.classList.toggle('hidden', !isLoggedInUser);
    }
    if (usernameSpan && user) {
        usernameSpan.textContent = user.username || '';
    }
    

    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    const mobileUsernameSpan = document.getElementById('mobileUsername');
    
    if (mobileLoginBtn) {
        mobileLoginBtn.classList.toggle('hidden', isLoggedInUser);
    }
    if (mobileLogoutBtn) {
        mobileLogoutBtn.classList.toggle('hidden', !isLoggedInUser);
    }
    if (mobileUsernameSpan && user) {
        mobileUsernameSpan.textContent = user.username || '';
        mobileUsernameSpan.classList.toggle('hidden', !isLoggedInUser);
    }
    
 
    const mobileSettingsLoginBtn = document.getElementById('mobileSettingsLoginBtn');
    const mobileSettingsLogoutBtn = document.getElementById('mobileSettingsLogoutBtn');
    const mobileSettingsUsernameSpan = document.getElementById('mobileSettingsUsername');
    
    if (mobileSettingsLoginBtn) {
        mobileSettingsLoginBtn.classList.toggle('hidden', isLoggedInUser);
    }
    if (mobileSettingsLogoutBtn) {
        mobileSettingsLogoutBtn.classList.toggle('hidden', !isLoggedInUser);
    }
    if (mobileSettingsUsernameSpan && user) {
        mobileSettingsUsernameSpan.textContent = user.username || '';
        mobileSettingsUsernameSpan.classList.toggle('hidden', !isLoggedInUser);
    }
    

    if (typeof updateLocalSaveCheckbox === 'function') {
        updateLocalSaveCheckbox();
    }
    
    console.log(`🔐 Auth buttons updated. Logged in: ${isLoggedInUser}`);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 App initializing...');
    
    const savedUser = localStorage.getItem('user');
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isLoggedIn = true;
        

        
        if (typeof loadFromMySQL === 'function') loadFromMySQL();
        if (typeof loadUserData === 'function') loadUserData();
        
    } else {
        isLoggedIn = false;
        currentUser = { id: 'guest_' + Date.now() };
        

        
        if (typeof loadFromLocal === 'function') loadFromLocal();
    }
    
    updateAuthButtons();
    
    if (isLoggedIn && typeof loadUserData === 'function') {
        loadUserData();
    }

    document.body.classList.add('dark');
    setFontSize(currentFontSize, false);
    updateMonthDisplay();
    updateCategorySelect();
    setDefaultDate();
    populateYearSelect();
    initIconGrid();

    const savedFilter = localStorage.getItem('fin_account_filter');
    if (savedFilter) {
        accountFilterId = savedFilter;
        updateAccountFilterDropdown();
    }

    setTimeout(() => {
        updateCopyBudgetButtonText();
    }, 500);

    updateAccountSelect();
    updateAccountFilterDropdown();
    
    if (financeDB) {
        financeDB.init().then(() => {
            console.log("✅ FinanceDB พร้อมใช้งานแล้ว");
            
            

            updateUI();
            renderCalendar();
            
            const currentPage = getCurrentPage();
            if (currentPage === 'budget') {
                updateBudgetUI();
            } else if (currentPage === 'analysis') {
                refreshAnalysisCharts();
            } else if (currentPage === 'yearly') {
                updateYearlyUI();
            } else if (currentPage === 'debt') {
                renderDebtPage();
            } else if (currentPage === 'accounts') {
                renderAccountsList();
            }
            
            setTimeout(() => {
                bindHistoryItemEvents();
            }, 300);
            updateAuthButtons();

            
        });
    }
    
    document.getElementById('mobileDateInput').value = new Date().toISOString().split('T')[0];
    
    const savedBudgetMode = localStorage.getItem('fin_budget_mode');
    if (savedBudgetMode) {
        budgetMode = savedBudgetMode;
    }
    
    setTimeout(() => {
        if (document.getElementById('budgetModePercent')) {
            setBudgetMode(budgetMode);
        }
    }, 1000);
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (isMobile() && !document.getElementById('mobileActionModal').classList.contains('hidden')) {
                closeMobileActionModal();
            }
            if (sideMenuOpen) {
                closeMobileSideMenu();
            }
        }
    });
    
    console.log("=== WINDOW LOAD END ===");

    setTimeout(() => {
        updateLocalSaveCheckbox();
    }, 500);
});

function closeMenuOnPageChange() {
    if (sideMenuOpen) {
        closeMobileSideMenu();
    }
}

function updateSideMenuActive(page) {
    const menuItems = document.querySelectorAll('#sideMenuPanel button');
    menuItems.forEach(item => {
        item.classList.remove('bg-indigo-50', 'dark:bg-indigo-900/30', 'text-indigo-600', 'dark:text-indigo-400');
    });
    
    let selector = '';
    switch(page) {
        case 'overview': selector = '[onclick*="switchPage(\'overview\')"]'; break;
        case 'budget': selector = '[onclick*="switchPage(\'budget\')"]'; break;
        case 'analysis': selector = '[onclick*="switchPage(\'analysis\')"]'; break;
        case 'yearly': selector = '[onclick*="switchPage(\'yearly\')"]'; break;
        case 'accounts': selector = '[onclick*="switchPage(\'accounts\')"]'; break; 
        default: return; 
    }
    
    if (!selector) return; 

    const activeItem = document.querySelector(selector);
    if (activeItem) {
        activeItem.classList.add('bg-indigo-50', 'dark:bg-indigo-900/30', 'text-indigo-600', 'dark:text-indigo-400');
    }
}

const originalSwitchPage = switchPage;
switchPage = function(page) {
    originalSwitchPage(page);
    
    setTimeout(() => {
        updateAccountFilterDropdown();
        
        if (page === 'overview') {
            setTimeout(() => {
                bindHistoryItemEvents();
            }, 200);
        }
    }, 100);
    
    if (isMobile()) {
        updateSideMenuActive(page);
        closeMenuOnPageChange();
    }
};

function toggleMobileSideMenu() {
    const sideMenu = document.getElementById('mobileSideMenu');
    const sideMenuPanel = document.getElementById('sideMenuPanel');
    const backdrop = document.getElementById('sideMenuBackdrop');
    const hamburgerBtn = document.getElementById('hamburgerMenuBtn');
    
    sideMenuOpen = !sideMenuOpen;
    
    if (sideMenuOpen) {
        sideMenu.classList.remove('hidden');
        document.body.classList.add('side-menu-open');
        
        setTimeout(() => {
            sideMenuPanel.style.transform = 'translateX(0)';
            backdrop.style.opacity = '1';
        }, 10);
        
        document.body.style.overflow = 'hidden';
    } else {
        sideMenuPanel.style.transform = '-translate-x-full';
        backdrop.style.opacity = '0';
        document.body.classList.remove('side-menu-open');
        
        setTimeout(() => {
            sideMenu.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }, 50);
    }
}

function openMobileSettingsModal() {
    document.getElementById('mobileSettingsModal').classList.remove('hidden');
}

function closeMobileSettingsModal() {
    document.getElementById('mobileSettingsModal').classList.add('hidden');
    document.getElementById('settingsModal').classList.add('hidden');
    
    
    
        switchPage('overview');
    
}




function formatThaiDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); 
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
}

function updateMobileDateDisplay() {
    const displayElement = document.getElementById('mobileDateDisplay');
    if (displayElement) {
        displayElement.textContent = formatThaiDate(mobileFormState.date);
    }
}

function updateMobileTagSuggestions() {
    const container = document.getElementById('mobileTagSuggestions');
    if (!container) return;
    
    const category = mobileFormState.categoryLabel;
    if (!category) {
        container.innerHTML = '';
        return;
    }
    
    const tagCounts = {};
    transactions.forEach(t => {
        if (t.category === category && t.tag && t.tag.trim() !== '') {
            const tag = t.tag.trim();
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        }
    });
    
    const sortedTags = Object.keys(tagCounts)
        .sort((a, b) => tagCounts[b] - tagCounts[a])
        .slice(0, 15); 
    
    if (sortedTags.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = sortedTags.map(tag => `
        <span onclick="selectMobileTag('${tag}')" 
              class="px-2 py-1 bg-indigo-100 text-indigo-600 text-[10px] font-bold rounded-lg cursor-pointer">
            #${tag}
        </span>
    `).join('');
}

function selectMobileTag(tag) {
    const tagInput = document.getElementById('mobileTag');
    if (tagInput) {
        tagInput.value = tag;
        mobileFormState.tag = tag;
    }
}

function showLoadingModal() {
    const toast = document.getElementById('toast');
    toast.innerText = '🔄 กำลังโหลดข้อมูล...';
    toast.style.display = 'block';
    toast.style.opacity = '1';
    toast.style.backgroundColor = '#3b82f6'; 
}

function closeLoadingModal() {
    const toast = document.getElementById('toast');
    toast.style.opacity = '0';
    setTimeout(() => {
        toast.style.display = 'none';
        toast.style.backgroundColor = ''; 
    }, 300);
}

async function refreshAppData() {
    if (isRefreshing) {
        showToast("⚠️ กำลังโหลดอยู่...");
        return;
    }
    
    isRefreshing = true;
    
    toggleSettingsModal();
    
    showLoadingModal();
    
    try {
        console.log("🔄 เริ่มโหลดข้อมูลใหม่...");
        
        const latestTransactions = await financeDB.getAllTransactions();
        
        transactions = latestTransactions;
        
        console.log(`✅ โหลดข้อมูลสำเร็จ: ${transactions.length} รายการ (ทุกเดือน)`);
        
        const currentPage = getCurrentPage();
        
        switch(currentPage) {
            case 'overview':
                updateUI();
                renderCalendar();
                break;
            case 'budget':
                updateBudgetUI();
                break;
            case 'analysis':
                refreshAnalysisCharts();
                break;
            case 'yearly':
                updateYearlyUI();
                if (document.getElementById('y-tab-tags').classList.contains('active')) {
                    updateYearlyTagsUI();
                }
                break;
            case 'debt':
                renderDebtPage();
                break;
            case 'accounts':
                renderAccountsList();
                break;
        }
        
        showToast(`✅ โหลดข้อมูลสำเร็จ (${transactions.length} รายการ)`);
        
    } catch (error) {
        console.error("❌ เกิดข้อผิดพลาดในการโหลด:", error);
        showToast("❌ โหลดข้อมูลไม่สำเร็จ: " + error.message);
    } finally {
        closeLoadingModal();
        isRefreshing = false;
    }
}


function initTransferForm() {
    console.log("🔄 initTransferForm() ถูกเรียก");
    
    const fromSelect = document.getElementById('transferFromAccount');
    const toSelect = document.getElementById('transferToAccount');
    const amountInput = document.getElementById('transferAmount');
    
    if (!fromSelect || !toSelect || !amountInput) {
        console.error("❌ transfer form elements ไม่พร้อม, จะลองอีกครั้งใน 500ms");
        setTimeout(initTransferForm, 500);
        return;
    }
    
    updateTransferAccountSelects();
    
    loadTransferHistory();
    
    fromSelect.value = "";
    toSelect.value = "";
    amountInput.value = "";
    
    document.getElementById('fromAccountBalance').innerHTML = 
        `<span class="text-slate-400">ยอดคงเหลือ: --</span>`;
    document.getElementById('toAccountBalance').innerHTML = 
        `<span class="text-slate-400">ยอดคงเหลือ: --</span>`;
    
    createTransferTypeUI();
    
    console.log("✅ initTransferForm() เสร็จสิ้น");
}

function createTransferTypeUI() {
    const transferForm = document.getElementById('transferForm');
    if (!transferForm) return;
    
    if (document.getElementById('transferTypeContainer')) {
        return;
    }
    
    const typeHTML = `
        <!-- Transfer Type Selection -->
        <div id="transferTypeContainer" class="space-y-3 mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <h4 class="font-bold text-base dark:text-white mb-3 flex items-center gap-2">
                <span class="text-lg">📊</span>
                ประเภทการโอนเงิน
            </h4>
            
            <!-- Radio Buttons -->
            <div class="space-y-2">
                <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="transferType" value="internal" checked 
                           class="w-4 h-4 text-indigo-600" 
                           onchange="toggleTransferIncomeCategory()">
                    <span class="text-sm dark:text-white">โอนเงินภายใน (ไม่นับสถิติ)</span>
                </label>
                <div class="text-xs text-slate-400 ml-6">
                    แค่ย้ายเงินระหว่างบัญชี ไม่นับเป็นรายรับ/รายจ่าย
                </div>
                
                <label class="flex items-center gap-2 cursor-pointer mt-3">
                    <input type="radio" name="transferType" value="as_income"
                           class="w-4 h-4 text-indigo-600"
                           onchange="toggleTransferIncomeCategory()">
                    <span class="text-sm dark:text-white">รับเงินโอนเป็นรายรับ</span>
                </label>
                <div class="text-xs text-slate-400 ml-6">
                    นับเป็นรายรับในสถิติ (เช่น ธุรกิจ → ส่วนตัว)
                </div>
            </div>
            
            <!-- Income Category Selector (แสดงเมื่อเลือก as_income) -->
            <div id="incomeCategoryContainer" class="hidden mt-3">
                <label class="block text-xs font-bold text-slate-400 mb-2">
                    เลือกหมวดหมู่รายรับ
                </label>
                <select id="transferIncomeCategory" 
                        class="w-full p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none">
                    <option value="">-- เลือกหมวดหมู่ --</option>
                    ${customCategories.income.map(cat => `
                        <option value="${cat.label}">${cat.icon} ${cat.label}</option>
                    `).join('')}
                </select>
                <div class="text-xs text-slate-400 mt-1">
                    จะปรากฏในสถิติเป็นรายรับประเภทนี้
                </div>
            </div>
        </div>
    `;
    
    const transferButton = transferForm.querySelector('button[onclick="transferBetweenAccounts()"]');
    if (transferButton) {
        transferButton.insertAdjacentHTML('beforebegin', typeHTML);
    } else {
        transferForm.insertAdjacentHTML('beforeend', typeHTML);
    }
}

function toggleTransferIncomeCategory() {
    const asIncomeRadio = document.querySelector('input[name="transferType"][value="as_income"]');
    const categoryContainer = document.getElementById('incomeCategoryContainer');
    
    if (categoryContainer) {
        if (asIncomeRadio.checked) {
            categoryContainer.classList.remove('hidden');
            document.getElementById('transferIncomeCategory').required = true;
        } else {
            categoryContainer.classList.add('hidden');
            document.getElementById('transferIncomeCategory').required = false;
        }
    }
}

function updateTransferAccountSelects() {
    console.log("🔄 updateTransferAccountSelects() ถูกเรียก");
    
    const fromSelect = document.getElementById('transferFromAccount');
    const toSelect = document.getElementById('transferToAccount');
    
    if (!fromSelect || !toSelect) {
        console.error("❌ ไม่พบ element transferFromAccount หรือ transferToAccount");
        
        setTimeout(() => {
            console.log("🔄 ลองเรียก updateTransferAccountSelects() อีกครั้ง...");
            updateTransferAccountSelects();
        }, 500);
        return;
    }
    
    if (accounts.length === 0) {
        console.warn("⚠️ ไม่มีข้อมูลบัญชี, จะลองอีกครั้งเมื่อมีบัญชี");
        
        setTimeout(() => {
            if (accounts.length > 0) {
                updateTransferAccountSelects();
            }
        }, 1000);
        return;
    }
    
    const currentFromValue = fromSelect.value;
    const currentToValue = toSelect.value;
    
    console.log("📌 currentFromValue:", currentFromValue);
    console.log("📌 currentToValue:", currentToValue);
    
    let fromOptions = '<option value="">-- เลือกบัญชีต้นทาง --</option>';
    let toOptions = '<option value="">-- เลือกบัญชีปลายทาง --</option>';
    
    accounts.forEach(acc => {
        const balance = getAccountBalance(acc.id);
        const selected = (acc.id === currentFromValue) ? 'selected' : '';
        fromOptions += `<option value="${acc.id}" ${selected}>${acc.icon} ${acc.name} (฿${balance.toLocaleString()})</option>`;
    });
    
    accounts.forEach(acc => {
        const balance = getAccountBalance(acc.id);
        const selected = (acc.id === currentToValue) ? 'selected' : '';
        toOptions += `<option value="${acc.id}" ${selected}>${acc.icon} ${acc.name} (฿${balance.toLocaleString()})</option>`;
    });
    
    fromSelect.innerHTML = fromOptions;
    toSelect.innerHTML = toOptions;
    
    console.log("✅ fromSelect options:", fromSelect.options.length);
    console.log("✅ toSelect options:", toSelect.options.length);
    
    fromSelect.removeEventListener('change', handleFromSelectChange);
    toSelect.removeEventListener('change', handleToSelectChange);
    
    fromSelect.addEventListener('change', handleFromSelectChange);
    toSelect.addEventListener('change', handleToSelectChange);
    
    updateTransferBalanceDisplays();
    
    if (fromSelect.value) {
        handleFromSelectChange.call(fromSelect);
    }
}

function updateToSelectDropdown(excludeAccountId) {
    console.log("🔄 updateToSelectDropdown() called with excludeAccountId:", excludeAccountId);
    
    const toSelect = document.getElementById('transferToAccount');
    if (!toSelect) {
        console.error("❌ ไม่พบ transferToAccount");
        return;
    }
    
    const currentValue = toSelect.value;
    
    let optionsHTML = '<option value="">-- เลือกบัญชีปลายทาง --</option>';
    
    const filteredAccounts = excludeAccountId 
        ? accounts.filter(acc => acc.id !== excludeAccountId)
        : accounts;
    
    console.log("📋 filteredAccounts count:", filteredAccounts.length);
    
    filteredAccounts.forEach(acc => {
        const balance = getAccountBalance(acc.id);
        const selected = (acc.id === currentValue) ? 'selected' : '';
        optionsHTML += `<option value="${acc.id}" ${selected}>${acc.icon} ${acc.name} (฿${balance.toLocaleString()})</option>`;
    });
    
    toSelect.innerHTML = optionsHTML;
    
    console.log("✅ toSelect updated, options:", toSelect.options.length);
    
    if (currentValue && filteredAccounts.some(acc => acc.id === currentValue)) {
        toSelect.value = currentValue;
        console.log("📌 toSelect value restored to:", currentValue);
    }
}

function handleFromSelectChange() {
    const fromId = this.value;
    const toSelect = document.getElementById('transferToAccount');
    
    if (!fromId) {
        updateToSelectDropdown(""); 
        return;
    }
    
    updateToSelectDropdown(fromId);
    
    if (toSelect.value === fromId) {
        toSelect.value = "";
    }
    
    updateTransferBalanceDisplays();
}

function handleToSelectChange() {
    updateTransferBalanceDisplays();
}

function updateTransferBalanceDisplays() {
    const fromId = document.getElementById('transferFromAccount').value;
    const toId = document.getElementById('transferToAccount').value;
    
    if (fromId) {
        const fromBalance = getAccountBalance(fromId); 
        document.getElementById('fromAccountBalance').innerHTML = 
            `ยอดคงเหลือ: <span class="font-bold ${fromBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'}">฿${Math.abs(fromBalance).toLocaleString()}</span>`;
    } else {
        document.getElementById('fromAccountBalance').innerHTML = 
            `ยอดคงเหลือ: --`;
    }
    
    if (toId) {
        const toBalance = getAccountBalance(toId); 
        document.getElementById('toAccountBalance').innerHTML = 
            `ยอดคงเหลือ: <span class="font-bold ${toBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'}">฿${Math.abs(toBalance).toLocaleString()}</span>`;
    } else {
        document.getElementById('toAccountBalance').innerHTML = 
            `ยอดคงเหลือ: --`;
    }
}

// ============================================
// TRANSFER FUNCTIONS (เพิ่ม/แก้ไข)
// ============================================

async function saveTransferToBackend(transactionData) {
    if (!isLoggedIn || !navigator.onLine) {
        if (!saveToLocalEnabled) {
            showToast('❌ ไม่สามารถบันทึกได้ (ต้อง online เพื่อบันทึกที่ MySQL)', 'error');
            return false;
        }
        addToSyncQueue(transactionData, 'create');
        showToast('📦 ออฟไลน์: จะบันทึกเมื่อกลับมาออนไลน์', 'info');
        return false;
    }
    
    try {
        const response = await fetch(`${API_URL}/transactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUser.id,
                type: transactionData.type,
                amount: transactionData.amount,
                desc: transactionData.desc,
                category: transactionData.category,
                tag: transactionData.tag || '',
                icon: transactionData.icon,
                rawDate: transactionData.rawDate,
                month_key: transactionData.monthKey,
                accountId: transactionData.accountId,
                transferToAccountId: transactionData.transferToAccountId || null,
                transferType: transactionData.transferType || null,
                isDebtPayment: transactionData.isDebtPayment || false,
                originalDebtId: transactionData.originalDebtId || null
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ บันทึก transfer ที่ backend สำเร็จ');
            if (result.id && transactionData.id.startsWith('transfer_')) {
                transactionData.id = result.id.toString();
                transactionData.backendId = result.id;
            }
            return { success: true, id: result.id };
        } else {
            throw new Error(result.error || 'Unknown error');
        }
        
    } catch (error) {
        console.error('❌ บันทึก transfer ไม่สำเร็จ:', error);
        if (saveToLocalEnabled) {
            addToSyncQueue(transactionData, 'create');
        }
        return { success: false, error: error.message };
    }
}

async function transferBetweenAccounts() {
    const fromId = document.getElementById('transferFromAccount').value;
    const toId = document.getElementById('transferToAccount').value;
    const amount = parseFloat(document.getElementById('transferAmount').value);
    const transferType = document.querySelector('input[name="transferType"]:checked')?.value || 'internal';
    const incomeCategory = document.getElementById('transferIncomeCategory')?.value || '';
    const fromBalance = getAccountBalance(fromId);
    const transactionId = 'transfer_' + Date.now();
    const receiveTransactionId = 'transfer_receive_' + Date.now();
    const now = new Date().toISOString().split('T')[0];
    const currentMonthKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    
    // Validation
    if (!fromId) {
        showToast("กรุณาเลือกบัญชีต้นทาง");
        return;
    }
    
    if (!toId) {
        showToast("กรุณาเลือกบัญชีปลายทาง");
        return;
    }
    
    if (fromId === toId) {
        showToast("ไม่สามารถโอนเข้าบัญชีเดียวกันได้");
        return;
    }
    
    if (fromBalance < amount) {
        showToast(`❌ ยอดเงินไม่พอ (มีแค่ ฿${fromBalance.toLocaleString()})`);
        return;
    }
    
    if (transferType === 'as_income' && !incomeCategory) {
        showToast("กรุณาเลือกหมวดหมู่รายรับ");
        return;
    }

    const fromAccount = getAccountById(fromId);
    const toAccount = getAccountById(toId);
    
    if (!fromAccount || !toAccount) {
        showToast("ไม่พบข้อมูลบัญชี");
        return;
    }
    
    // ✅ สร้าง transaction ฝั่งต้นทาง
    const transferTransaction = {
        id: transactionId,
        amount: amount,
        type: 'transfer',
        transferType: transferType,
        category: transferType === 'as_income' ? incomeCategory : 'โอนเงิน',
        icon: transferType === 'as_income' ? '💰' : '🔄',
        desc: transferType === 'as_income' 
            ? `โอนไป ${toAccount.name} (${incomeCategory})`
            : `โอนไป ${toAccount.name}`,
        tag: '',
        rawDate: now,
        monthKey: currentMonthKey,
        date: now,
        accountId: fromId,
        transferToAccountId: toId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner_type: isLoggedIn ? 'user' : 'guest', 
        owner_id: isLoggedIn ? currentUser.id : getGuestId()
    };
    
    // ✅ สร้าง transaction ฝั่งรับ (ทั้ง internal และ as_income)
    let receiveTransaction = null;
    
    if (transferType === 'as_income') {
        // as_income: ฝั่งรับเป็น income
        receiveTransaction = {
            id: receiveTransactionId,
            amount: amount,
            type: 'income',
            transferType: 'receive_income',
            category: incomeCategory,
            icon: '💰',
            desc: `รับโอนจาก ${fromAccount.name}`,
            tag: '',
            rawDate: now,
            monthKey: currentMonthKey,
            date: now,
            accountId: toId,
            transferFromAccountId: fromId,
            originalTransferId: transactionId,
            isTransferIncome: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            owner_type: isLoggedIn ? 'user' : 'guest',
            owner_id: isLoggedIn ? currentUser.id : getGuestId()
        };
    } else {

// internal transfer: ฝั่งรับเป็น transfer (บวกเงิน)
receiveTransaction = {
    id: receiveTransactionId,
    amount: amount,
    type: 'transfer',
    transferType: 'internal_receive',
    category: 'รับโอนเงิน',
    icon: '🔄',
    desc: `รับโอนจาก ${fromAccount.name}`,
    tag: '',
    rawDate: now,
    monthKey: currentMonthKey,
    date: now,
    accountId: toId,
    transferFromAccountId: fromId,
    transferToAccountId: null,
    originalTransferId: transactionId,
    isTransferIncome: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    owner_type: isLoggedIn ? 'user' : 'guest',
    owner_id: isLoggedIn ? currentUser.id : getGuestId()
};
    }
    
    // ✅ ตรวจสอบ saveToLocalEnabled
    const saveToLocalCheckbox = document.getElementById('saveToLocalCheckbox');
    const shouldSaveToLocal = saveToLocalCheckbox ? saveToLocalCheckbox.checked : true;
    
    console.log('📊 Transfer - fromId:', fromId);
    console.log('📊 Transfer - toId:', toId);
    console.log('📊 Transfer - transferType:', transferType);
    console.log('📊 Transfer - transferTransaction:', transferTransaction);
    console.log('📊 Transfer - receiveTransaction:', receiveTransaction);
    console.log('📊 Transfer - saveToLocalEnabled:', shouldSaveToLocal);
    
    try {
    // 1. บันทึกที่ MySQL (ถ้า login และออนไลน์)
    if (isLoggedIn && navigator.onLine) {
        console.log('🌐 บันทึก transfer ไป MySQL...');
        
        await saveTransactionToBackend(transferTransaction);
        if (receiveTransaction) {
            await saveTransactionToBackend(receiveTransaction);
        }
        
        console.log('✅ บันทึก MySQL สำเร็จ');
    } else if (isLoggedIn && !navigator.onLine && !shouldSaveToLocal) {
        showToast('❌ ไม่สามารถบันทึกการโอนได้ (ต้อง online เพื่อบันทึกที่ MySQL)', 'error');
        return;
    } else if (isLoggedIn && !navigator.onLine && shouldSaveToLocal) {
        addToSyncQueue(transferTransaction, 'create');
        if (receiveTransaction) {
            addToSyncQueue(receiveTransaction, 'create');
        }
        showToast('📦 ออฟไลน์: รอซิงค์อัตโนมัติ', 'info');
    }
    
    // 2. บันทึกที่ Local (เฉพาะเมื่อติ๊ก checkbox หรือ Guest mode)
    if (!isLoggedIn || shouldSaveToLocal) {
        console.log('💾 บันทึก transfer ลงเครื่อง...');
        
        await financeDB.saveTransaction(transferTransaction);
        if (receiveTransaction) {
            await financeDB.saveTransaction(receiveTransaction);
        }
        
        console.log('✅ บันทึก Local สำเร็จ');
    } else {
        console.log('⏭️ ข้ามการบันทึก Local (checkbox ไม่ติ๊ก)');
    }
    
    // ✅ โหลดข้อมูลใหม่เพียงครั้งเดียว (หลังบันทึกเสร็จ)
    if (isLoggedIn && navigator.onLine) {
        await loadTransactionsFromBackend();
        transactions = backendTransactions;
    } else {
        const freshTransactions = await financeDB.getAllTransactions();
        transactions = freshTransactions;
    }
    
    // 3. รีเฟรช UI
    document.getElementById('transferAmount').value = '';
    updateTransferBalanceDisplays();
    loadTransferHistory();
    renderAccountsList();
    updateUI();
    refreshAnalysisCharts();
    
    const toastMsg = `✅ โอนเงินสำเร็จ ฿${amount.toLocaleString()} ${transferType === 'as_income' ? '(นับเป็นรายรับ)' : ''}`;
    showToast(toastMsg);
    
} catch (error) {
    console.error('❌ Error transferring:', error);
    showToast("❌ โอนเงินไม่สำเร็จ: " + error.message);
}
}

function loadTransferHistory() {
    const container = document.getElementById('transferHistoryList');
    if (!container) return;
    
const transfers = transactions
    .filter(t => t.type === 'transfer' || (t.type === 'income' && t.isTransferIncome))
        .sort((a, b) => {
            const dateA = new Date(a.createdAt || a.rawDate || a.date);
            const dateB = new Date(b.createdAt || b.rawDate || b.date);
            return dateB - dateA; 
        })
        .slice(0, 20);
    
    if (transfers.length === 0) {
        document.getElementById('transferHistory').classList.add('hidden');
        return;
    }
    
    document.getElementById('transferHistory').classList.remove('hidden');
    
    container.innerHTML = transfers.map(t => {
        const fromAccount = t.type === 'income' && t.isTransferIncome 
            ? getAccountById(t.transferFromAccountId || t.accountId)  
            : getAccountById(t.accountId);  
        
        const toAccount = t.type === 'income' && t.isTransferIncome 
            ? getAccountById(t.accountId)  
            : getAccountById(t.transferToAccountId || t.accountId); 
        const date = new Date(t.rawDate);
        const dateStr = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        
        return `
        <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div class="flex justify-between items-center">
                <div>
                    <div class="font-bold text-sm dark:text-white">
    ${t.type === 'income' && t.isTransferIncome ? '💰 ' : '🔄 '}
    ${t.desc}
    ${t.transferType === 'as_income' ? ' (นับเป็นรายรับ)' : ''}
</div>
                    <div class="text-xs text-slate-400">${dateStr}</div>
                </div>
                <div class="text-right">
                    <div class="font-bold text-indigo-600 dark:text-indigo-400">฿${t.amount.toLocaleString()}</div>
                    <div class="text-[10px] text-slate-400">สำเร็จ</div>
                </div>
            </div>
        </div>
        `;
    }).join('');
}


function openImportCSVModal() {
    toggleSettingsModal();
    
    document.getElementById('csvReplaceData').checked = false;
    document.getElementById('csvSkipDuplicates').checked = true;
    document.getElementById('csvImportCategories').checked = true;
    document.getElementById('csvFileName').textContent = '';
    document.getElementById('csvImportProgress').classList.add('hidden');
    document.getElementById('processCSVBtn').disabled = true;
    
    const fileInput = document.getElementById('csvFileUpload');
    fileInput.value = ''; 
    fileInput.onchange = function(e) {
        if (e.target.files.length > 0) {
            const fileName = e.target.files[0].name;
            document.getElementById('csvFileName').textContent = `ไฟล์: ${fileName}`;
            document.getElementById('processCSVBtn').disabled = false;
        }
    };
    
    document.getElementById('importCSVModal').classList.remove('hidden');
}

function closeImportCSVModal() {
    document.getElementById('importCSVModal').classList.add('hidden');
}

function triggerCSVImport() {
    document.getElementById('importCSVFile').click();
}

async function exportToCSV() {
    try {
        console.log("📤 เริ่ม Export ข้อมูลเป็น CSV...");
        
        toggleSettingsModal();
        
        const allTransactions = await financeDB.getAllTransactions();
        
        if (allTransactions.length === 0) {
            showToast("ไม่มีข้อมูลสำหรับ Export");
            return;
        }
        
        const csvData = prepareCSVData(allTransactions);
        
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `FlowWallet_Export_${getCurrentDateString()}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast(`✅ Export สำเร็จ (${allTransactions.length} รายการ)`);
        console.log(`✅ Export CSV สำเร็จ: ${allTransactions.length} รายการ`);
        
    } catch (error) {
        console.error("❌ Export CSV ล้มเหลว:", error);
        showToast("❌ Export ไม่สำเร็จ: " + error.message);
    }
}

function prepareCSVData(transactions) {
    const headers = [
        'วันที่',
        'ประเภท',
        'หมวดหมู่',
        'จำนวนเงิน',
        'คำอธิบาย',
        'TAG',
        'บัญชี',
        'เดือน',
        'ปี',
        'สร้างเมื่อ',
        'อัปเดตล่าสุด'
    ];
    
    const rows = transactions.map(t => {
        const date = new Date(t.rawDate || t.date);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        
        return [
            t.rawDate || t.date || '',
            t.type || '',
            t.category || '',
            t.amount || 0,
            t.desc || '',
            t.tag || '',
            t.accountId || '',
            month,
            year,
            t.createdAt || '',
            t.updatedAt || ''
        ];
    });
    
    const csvArray = [headers, ...rows];
    
    return csvArray.map(row => 
        row.map(cell => {
            if (typeof cell === 'string' && cell.includes(',')) {
                return `"${cell}"`;
            }
            return cell;
        }).join(',')
    ).join('\n');
}

function getCurrentDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return `${year}${month}${day}_${hours}${minutes}`;
}

function downloadCSVTemplate() {
    const templateHeaders = [
        'วันที่ (YYYY-MM-DD)',
        'ประเภท (income/expense/transfer)',
        'หมวดหมู่',
        'จำนวนเงิน',
        'คำอธิบาย',
        'TAG',
        'บัญชี',
        'หมายเหตุ'
    ];
    
    const exampleData = [
        ['2024-01-15', 'income', 'เงินเดือน', '30000', 'เงินเดือนประจำเดือน', 'งาน', 'acc_123', ''],
        ['2024-01-16', 'expense', 'กิน', '150', 'อาหารกลางวัน', 'อาหาร', 'acc_123', 'ร้านข้าวแกง'],
        ['2024-01-17', 'expense', 'น้ำมัน', '500', 'เติมน้ำมัน', 'รถ', 'acc_123', 'PTT'],
        ['2024-01-18', 'income', 'โบนัส', '5000', 'โบนัสประจำปี', 'งาน', 'acc_456', ''],
        ['2024-01-19', 'expense', 'สังคม', '300', 'ดูหนังกับเพื่อน', 'บันเทิง', 'acc_123', 'SF Cinema']
    ];
    
    const csvArray = [templateHeaders, ...exampleData];
    const csvContent = csvArray.map(row => 
        row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'FlowWallet_Template.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast("📥 ดาวน์โหลด Template สำเร็จ");
}

async function processCSVImport() {
    const fileInput = document.getElementById('csvFileUpload');
    const file = fileInput.files[0];
    
    if (!file) {
        showToast("กรุณาเลือกไฟล์ CSV ก่อน");
        return;
    }
    
    const replaceData = document.getElementById('csvReplaceData').checked;
    const skipDuplicates = document.getElementById('csvSkipDuplicates').checked;
    const importCategories = document.getElementById('csvImportCategories').checked;
    
    document.getElementById('csvImportProgress').classList.remove('hidden');
    document.getElementById('processCSVBtn').disabled = true;
    updateCSVProgress(0, 'กำลังอ่านไฟล์...');
    
    try {
        const reader = new FileReader();
        
        reader.onload = async function(e) {
            try {
                const csvText = e.target.result;
                const transactions = parseCSVData(csvText);
                
                if (transactions.length === 0) {
                    updateCSVProgress(100, 'ไม่พบข้อมูลในไฟล์');
                    showToast("❌ ไม่พบข้อมูลในไฟล์ CSV");
                    return;
                }
                
                updateCSVProgress(10, `พบ ${transactions.length} รายการ`);
                
                const validationResult = validateCSVData(transactions);
                if (!validationResult.valid) {
                    updateCSVProgress(100, 'ข้อมูลไม่ถูกต้อง');
                    showToast(`❌ ข้อมูลไม่ถูกต้อง: ${validationResult.error}`);
                    return;
                }
                
                if (replaceData) {
                    transactions.forEach(t => {
                        t.id = `csv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    });
                    
                    const currentTransactions = await financeDB.getAllTransactions();
                    for (const tx of currentTransactions) {
                        await financeDB.deleteTransaction(tx.id);
                    }
                    
                    transactions = [];
                    updateCSVProgress(30, 'ล้างข้อมูลเดิมแล้ว');
                }
                
                let importedCount = 0;
                let skippedCount = 0;
                let errorCount = 0;
                
                for (let i = 0; i < transactions.length; i++) {
                    const tx = transactions[i];
                    const progress = Math.floor(((i + 1) / transactions.length) * 100);
                    
                    try {
                        if (skipDuplicates) {
                            const existing = await checkDuplicateTransaction(tx);
                            if (existing) {
                                skippedCount++;
                                updateCSVProgress(progress, `ข้ามรายการที่ ${i + 1} (ซ้ำ)`);
                                continue;
                            }
                        }
                        
                        if (tx.accountId && !getAccountById(tx.accountId)) {
                            await createAccountFromCSV(tx.accountId);
                        }
                        
                        const result = await financeDB.saveTransaction(tx);
                        
                        if (result.success) {
                            importedCount++;
                            const existsInMemory = transactions.some(t => t.id === tx.id);
                            if (!existsInMemory) {
                                transactions.unshift(tx);
                            }
                        } else {
                            errorCount++;
                        }
                        
                        updateCSVProgress(progress, `กำลังบันทึก ${i + 1}/${transactions.length}`);
                        
                    } catch (error) {
                        console.error(`❌ ข้อผิดพลาดรายการที่ ${i + 1}:`, error);
                        errorCount++;
                    }
                }
                
                if (importCategories) {
                    updateCategoriesFromCSV(transactions);
                }
                
                updateUI();
                refreshAnalysisCharts();
                
                updateCSVProgress(100, 'นำเข้าสำเร็จ!');
                
                const summary = `นำเข้า: ${importedCount}, ข้าม: ${skippedCount}, ข้อผิดพลาด: ${errorCount}`;
                showToast(`✅ Import สำเร็จ! ${summary}`);
                
                setTimeout(() => {
                    closeImportCSVModal();
                }, 2000);
                
            } catch (error) {
                console.error("❌ ข้อผิดพลาดในการประมวลผล CSV:", error);
                updateCSVProgress(100, 'เกิดข้อผิดพลาด');
                showToast("❌ Import ล้มเหลว: " + error.message);
            }
        };
        
        reader.onerror = function() {
            updateCSVProgress(100, 'อ่านไฟล์ล้มเหลว');
            showToast("❌ อ่านไฟล์ล้มเหลว");
        };
        
        reader.readAsText(file, 'UTF-8');
        
    } catch (error) {
        console.error("❌ ข้อผิดพลาดใน processCSVImport:", error);
        updateCSVProgress(100, 'เกิดข้อผิดพลาด');
        showToast("❌ Import ล้มเหลว: " + error.message);
    }
}

function updateCSVProgress(percent, text) {
    document.getElementById('csvProgressBar').style.width = `${percent}%`;
    document.getElementById('csvProgressPercent').textContent = `${percent}%`;
    document.getElementById('csvProgressText').textContent = text;
}

function parseCSVData(csvText) {
    const transactions = [];
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const dataLines = lines.slice(1);
    
    dataLines.forEach((line, index) => {
        try {
            const rowData = parseCSVRow(line);
            
            if (rowData.length < headers.length) {
                console.warn(`⚠️ แถว ${index + 1}: ข้อมูลไม่ครบ`, rowData);
                return;
            }
            
            const tx = {};
            headers.forEach((header, i) => {
                if (rowData[i] !== undefined) {
                    tx[header] = rowData[i].trim();
                }
            });
            
            const formattedTx = formatTransactionFromCSV(tx);
            if (formattedTx) {
                transactions.push(formattedTx);
            }
            
        } catch (error) {
            console.error(`❌ ข้อผิดพลาดในการแยกแถว ${index + 1}:`, error);
        }
    });
    
    return transactions;
}

function parseCSVRow(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current);
    return result.map(cell => cell.replace(/^"|"$/g, '').trim());
}

function formatTransactionFromCSV(csvRow) {
    try {
        const now = new Date();
        const dateStr = csvRow['วันที่'] || csvRow['Date'] || now.toISOString().split('T')[0];
        const date = new Date(dateStr);
        
        if (isNaN(date.getTime())) {
            console.warn('❌ วันที่ไม่ถูกต้อง:', csvRow['วันที่']);
            return null;
        }
        
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const amount = parseFloat(csvRow['จำนวนเงิน'] || csvRow['Amount'] || 0);
        
        if (!amount || isNaN(amount)) {
            console.warn('❌ จำนวนเงินไม่ถูกต้อง:', csvRow['จำนวนเงิน']);
            return null;
        }
        
        const type = (csvRow['ประเภท'] || csvRow['Type'] || 'expense').toLowerCase();
        const category = csvRow['หมวดหมู่'] || csvRow['Category'] || 'อื่นๆ';
        const desc = csvRow['คำอธิบาย'] || csvRow['Description'] || category;
        const tag = csvRow['TAG'] || csvRow['Tag'] || '';
        
        const allCats = [
            ...customCategories.income,
            ...customCategories.spending,
            ...customCategories.investment
        ];
        const catInfo = allCats.find(c => c.label === category);
        const icon = catInfo ? catInfo.icon : '📝';
        
        let accountId = csvRow['บัญชี'] || csvRow['Account'] || currentAccountId;
        if (accountId && !getAccountById(accountId)) {
            accountId = currentAccountId;
        }
        
        return {
            id: `csv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            amount: Math.abs(amount),
            type: type,
            category: category,
            icon: icon,
            desc: desc,
            tag: tag,
            rawDate: dateStr,
            monthKey: monthKey,
            date: dateStr,
            accountId: accountId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),

            importedFromCSV: true,
            csvNote: csvRow['หมายเหตุ'] || csvRow['Note'] || ''
        };
        
    } catch (error) {
        console.error('❌ ข้อผิดพลาดในการแปลงข้อมูล:', error, csvRow);
        return null;
    }
}

function validateCSVData(transactions) {
    if (transactions.length === 0) {
        return { valid: false, error: 'ไม่มีข้อมูล' };
    }
    
    const errors = [];
    
    transactions.forEach((tx, index) => {
        if (!tx.amount || tx.amount <= 0) {
            errors.push(`แถว ${index + 1}: จำนวนเงินไม่ถูกต้อง`);
        }
        
        if (!tx.type || !['income', 'expense', 'transfer'].includes(tx.type)) {
            errors.push(`แถว ${index + 1}: ประเภทไม่ถูกต้อง`);
        }
        
        if (!tx.rawDate) {
            errors.push(`แถว ${index + 1}: วันที่ไม่ถูกต้อง`);
        }
    });
    
    if (errors.length > 0) {
        return { 
            valid: false, 
            error: errors.slice(0, 3).join(', ') + (errors.length > 3 ? '...' : '') 
        };
    }
    
    return { valid: true };
}

async function checkDuplicateTransaction(tx) {
    try {
        const duplicate = transactions.find(t => 
            t.rawDate === tx.rawDate &&
            t.amount === tx.amount &&
            t.category === tx.category &&
            t.desc === tx.desc
        );
        
        return duplicate || null;
    } catch (error) {
        console.error('❌ ข้อผิดพลาดในการตรวจสอบซ้ำ:', error);
        return null;
    }
}

async function createAccountFromCSV(accountId) {
    if (getAccountById(accountId)) return;
    
    const newAccount = {
        id: accountId,
        name: accountId,
        type: 'savings',
        icon: '🏦',
        color: getRandomAccountColor(),
        initialBalance: 0,
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    accounts.push(newAccount);
    saveAccounts();
    console.log(`✅ สร้างบัญชีใหม่จาก CSV: ${accountId}`);
}

function updateCategoriesFromCSV(transactions) {
    const newCategories = {
        income: [...customCategories.income],
        spending: [...customCategories.spending],
        investment: [...customCategories.investment]
    };
    
    transactions.forEach(tx => {
        const categoryExists = [...newCategories.income, ...newCategories.spending, ...newCategories.investment]
            .some(c => c.label === tx.category);
        
        if (!categoryExists && tx.category) {
            newCategories.spending.push({
                id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                label: tx.category,
                icon: '📝',
                default: null
            });
        }
    });
    
    customCategories = newCategories;
    localStorage.setItem('fin_custom_cats', JSON.stringify(customCategories));
    
    updateCategorySelect();
    
    console.log(`✅ อัพเดตหมวดหมู่จาก CSV สำเร็จ`);
}


async function generatePDFReport() {
    try {
        toggleSettingsModal();
        
        showToast("🔄 กำลังสร้างรายงาน PDF...");
        
        
        await createHTMLReport();
        
    } catch (error) {
        console.error('Error generating report:', error);
        showToast('❌ สร้างรายงานไม่สำเร็จ: ' + error.message);
    }
}

async function createHTMLReport() {
    const reportData = await gatherReportData();
    const htmlContent = createPDFHTML(reportData);  
    await downloadHTMLFile(htmlContent, reportData);
}

async function downloadHTMLFile(htmlContent, data) {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FlowWallet_Report_${data.month}_${data.year}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('✅ สร้างรายงาน HTML สำเร็จ (ใช้ Print to PDF จากเบราว์เซอร์)');
}

function generateChartColors(count) {
    const mainColors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#8AC926', '#1982C4', '#6A4C93', '#F15BB5',
        '#00BBF9', '#00F5D4', '#FF9E00', '#9B5DE5', '#00F5D4'
    ];
    
    const secondaryColors = [
        '#A663CC', '#B8F2E6', '#FAF3DD', '#C8B8DB', '#B5EAD7',
        '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA', '#FFB7B2',
        '#FF9AA2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA'
    ];
    
    const result = [];
    
    for (let i = 0; i < count; i++) {
        if (i < mainColors.length) {
            result.push(mainColors[i]);
        } else {
            result.push(secondaryColors[(i - mainColors.length) % secondaryColors.length]);
        }
    }
    
    return result;
}

async function gatherReportData() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const monthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    
    const transactions = await financeDB.getTransactionsByMonth(monthKey);
    
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;
    const investmentExpense = transactions
    .filter(t => t.type === 'expense' && 
           customCategories.investment.some(c => c.label === t.category))
    .reduce((sum, t) => sum + t.amount, 0);

const investmentRate = income > 0 ? (investmentExpense / income) * 100 : 0;
    
    const accountsBalance = accounts.map(acc => ({
        name: acc.name,
        balance: getAccountBalance(acc.id),
        icon: acc.icon
    }));
    
    const spendingByCategory = {};
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    expenseTransactions.forEach(t => {
        if (!spendingByCategory[t.category]) {
            spendingByCategory[t.category] = { 
                amount: 0, 
                count: 0, 
                icon: t.icon,
                percentage: 0
            };
        }
        spendingByCategory[t.category].amount += t.amount;
        spendingByCategory[t.category].count++;
    });
    
    Object.keys(spendingByCategory).forEach(category => {
        spendingByCategory[category].percentage = expense > 0 ? 
            (spendingByCategory[category].amount / expense) * 100 : 0;
    });
    
    const allCategories = Object.entries(spendingByCategory)
        .map(([category, data]) => ({ 
            category, 
            ...data 
        }))
        .sort((a, b) => b.amount - a.amount);  
    
    const spendingByTag = {};
    const taggedTransactions = expenseTransactions.filter(t => t.tag && t.tag.trim() !== '');
    
    taggedTransactions.forEach(t => {
        const tag = t.tag.trim();
        if (!spendingByTag[tag]) {
            spendingByTag[tag] = { 
                amount: 0, 
                count: 0,
                percentage: 0
            };
        }
        spendingByTag[tag].amount += t.amount;
        spendingByTag[tag].count++;
    });
    
    Object.keys(spendingByTag).forEach(tag => {
        spendingByTag[tag].percentage = expense > 0 ? 
            (spendingByTag[tag].amount / expense) * 100 : 0;
    });
    
    const allTags = Object.entries(spendingByTag)
        .map(([tag, data]) => ({ 
            tag, 
            ...data 
        }))
        .sort((a, b) => b.amount - a.amount);  

    const debtData = await getDebtReportData(currentYear);
const categoryPieData = {
    labels: allCategories.map(cat => cat.category),
    data: allCategories.map(cat => cat.amount),
    colors: generateChartColors(allCategories.length) 
};

const tagPieData = {
    labels: allTags.map(tag => tag.tag),
    data: allTags.map(tag => tag.amount),
    colors: generateChartColors(allTags.length)
};

    return {
        month: monthFullNames[currentMonth],
        year: currentYear,
        reportDate: new Date().toLocaleDateString('th-TH'),
        
        income,
        expense,
        balance,
        investmentRate: investmentRate.toFixed(1),
        transactionCount: transactions.length,
        expenseTransactionCount: expenseTransactions.length,
        taggedTransactionCount: taggedTransactions.length,
        debt: debtData,
        categoryPieData: categoryPieData,
        tagPieData: tagPieData,
        
        accounts: accountsBalance,
        totalBalance: calculateTotalBalance(),
        
        topCategories: allCategories,  
        topTags: allTags,  
        
    categoryPieData: {
        labels: allCategories.map(cat => cat.category),
        data: allCategories.map(cat => cat.amount),
        colors: generateChartColors(allCategories.length)
    },
    tagPieData: {
        labels: allTags.map(tag => tag.tag),
        data: allTags.map(tag => tag.amount),
        colors: generateChartColors(allTags.length)
    },
    };
}

function calculateCategoryStatistics(categories, totalExpense) {
    return categories.map(cat => ({
        ...cat,
        percentage: totalExpense > 0 ? ((cat.amount / totalExpense) * 100).toFixed(1) : 0
    }));
}

function calculateTagStatistics(tags, totalExpense) {
    return tags.map(tag => ({
        ...tag,
        percentage: totalExpense > 0 ? ((tag.amount / totalExpense) * 100).toFixed(1) : 0
    }));
}

async function getDebtReportData(year) {
    const yearDebts = debts.filter(debt => {
        const startDate = new Date(debt.startDate);
        return startDate.getFullYear() === year;
    });
    
    let totalDebt = 0;
    let totalPaid = 0;
    let activeDebts = 0;
    
    yearDebts.forEach(debt => {
        totalDebt += debt.totalAmount;
        const debtPayments = payments.filter(p => p.debtId === debt.id);
        const paidAmount = debtPayments.reduce((sum, p) => sum + p.amount, 0);
        totalPaid += paidAmount;
        if (debt.totalAmount - paidAmount > 0) activeDebts++;
    });
    
    return {
        totalDebt,
        totalPaid,
        remaining: totalDebt - totalPaid,
        debtCount: yearDebts.length,
        activeDebts,
        utilization: totalDebt > 0 ? (totalPaid / totalDebt) * 100 : 0,
        debts: yearDebts.slice(0, 5) 
    };
}


async function getBudgetReportData(monthKey) {
    const targets = categoryTargets[monthKey] || {};
    
    let totalBudget = 0;
    let totalSpent = 0;
    
    Object.entries(targets).forEach(([catId, target]) => {
        const cat = [...customCategories.spending, ...customCategories.investment]
            .find(c => c.id === catId);
        if (!cat) return;
        
        totalBudget += target.value || 0;
    });
    
    return {
        totalBudget,
        totalSpent,
        remaining: totalBudget - totalSpent,
        utilization: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0
    };
}
function createDebtReportHTML(debtData) {
    return `
        <div class="pdf-section">
            <div class="section-title">🏦 รายงานหนี้สิน</div>
            <!-- ✅ เพิ่มโค้ดจริง -->
            <div style="background: linear-gradient(135deg, #fef3f3 0%, #fee2e2 100%); padding: 20px; border-radius: 12px;">
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px;">
                    <div class="stat-card">
                        <div class="stat-label">ยอดหนี้ทั้งหมด</div>
                        <div class="stat-value" style="color: #ef4444;">฿${debtData.totalDebt.toLocaleString()}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">ชำระแล้ว</div>
                        <div class="stat-value" style="color: #10b981;">฿${debtData.totalPaid.toLocaleString()}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">คงเหลือ</div>
                        <div class="stat-value" style="color: #f59e0b;">฿${debtData.remaining.toLocaleString()}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">จำนวนหนี้</div>
                        <div class="stat-value">${debtData.debtCount} รายการ</div>
                    </div>
                </div>
                <div style="text-align: center; color: #64748b; font-size: 12px;">
                    อัตราการชำระ: ${debtData.utilization.toFixed(1)}% 
                    • หนี้ที่ยังต้องชำระ: ${debtData.activeDebts} รายการ
                </div>
            </div>
        </div>
    `;
}

function createPieChartHTML(pieData, title) {
    const displayData = {
        labels: pieData.labels,
        data: pieData.data,
        colors: pieData.colors
    };
    
    const total = displayData.data.reduce((a, b) => a + b, 0);
    const itemCount = displayData.labels.length;
    
    let displayLabels = displayData.labels;
    let displayDataValues = displayData.data;
    let displayColors = displayData.colors;
    let otherItems = [];
    
    if (itemCount > 15) {
        displayLabels = displayData.labels.slice(0, 15);
        displayDataValues = displayData.data.slice(0, 15);
        displayColors = displayData.colors.slice(0, 15);
        
        const otherAmount = displayData.data.slice(15).reduce((a, b) => a + b, 0);
        const otherCount = itemCount - 15;
        
        if (otherAmount > 0) {
            displayLabels.push(`อื่นๆ (${otherCount} รายการ)`);
            displayDataValues.push(otherAmount);
            displayColors.push('#CBD5E0'); 
        }
    }
    
    let html = `
        <div class="pie-chart-container" style="margin: 20px 0;">
            <div style="display: flex; flex-wrap: wrap; gap: 30px; align-items: flex-start;">
                <!-- Pie Chart -->
                <div style="flex: 1; min-width: 300px;">
                    <div style="text-align: center; margin-bottom: 15px;">
                        <div style="font-weight: bold; color: #4a5568; font-size: 16px;">${title}</div>
                        <div style="font-size: 12px; color: #718096; margin-top: 5px;">
                            รวมทั้งหมด ${itemCount} รายการ • ฿${total.toLocaleString()}
                        </div>
                    </div>
                    <div class="css-pie-chart" style="position: relative; width: 280px; height: 280px; margin: 0 auto;">
    `;
    
    let accumulatedAngle = 0;
    let gradients = [];
    
    displayDataValues.forEach((value, index) => {
        const percentage = (value / total) * 100;
        const angle = (percentage / 100) * 360;
        
        gradients.push(`${displayColors[index]} ${accumulatedAngle}deg ${accumulatedAngle + angle}deg`);
        accumulatedAngle += angle;
    });
    
    html += `
                        <div style="
                            width: 280px;
                            height: 280px;
                            border-radius: 50%;
                            background: conic-gradient(${gradients.join(', ')});
                            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                        "></div>
                        
                        <!-- Center circle -->
                        <div style="
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            width: 90px;
                            height: 90px;
                            border-radius: 50%;
                            background: white;
                            box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-weight: bold;
                            color: #2d3748;
                            font-size: 14px;
                            text-align: center;
                            line-height: 1.3;
                        ">
                            ${itemCount}<br>รายการ
                        </div>
                    </div>
                </div>
                
                <!-- Legend -->
                <div style="flex: 1; min-width: 350px;">
                    <div style="background: #f8fafc; padding: 20px; border-radius: 12px; max-height: 400px; overflow-y: auto; border: 1px solid #e2e8f0;">
                        <div style="font-weight: bold; margin-bottom: 15px; color: #4a5568; font-size: 14px;">
                            รายละเอียด${itemCount > 15 ? ' (แสดง 15 อันดับแรก)' : ''}
                        </div>
    `;
    
    displayDataValues.forEach((value, index) => {
        const percentage = ((value / total) * 100).toFixed(1);
        const label = displayLabels[index];
        
        html += `
            <div style="display: flex; align-items: center; margin-bottom: 8px; padding: 10px; background: white; border-radius: 8px; border: 1px solid #f1f5f9;">
                <div style="width: 16px; height: 16px; border-radius: 4px; background: ${displayColors[index]}; margin-right: 12px; flex-shrink: 0;"></div>
                <div style="flex: 1; font-size: 13px; min-width: 0;">
                    <div style="font-weight: 600; color: #334155; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${label}
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 12px; color: #64748b;">
                        <span>฿${value.toLocaleString()}</span>
                        <span>${percentage}%</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    if (itemCount > 15) {
        const otherCount = itemCount - 15;
        html += `
            <div style="margin-top: 15px; padding: 12px; background: #f1f5f9; border-radius: 8px; font-size: 12px; color: #64748b; text-align: center;">
                + อีก ${otherCount} รายการที่แสดงในตารางด้านล่าง
            </div>
        `;
    }
    
    html += `
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return html;
}

   function createPDFHTML(data) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>รายงานการเงิน ${data.month} ${data.year}</title>
        
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600&display=swap');
            
            body {
                font-family: 'Sarabun', sans-serif;
                line-height: 1.6;
                color: #333;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            
            .pdf-container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                border-radius: 20px;
                padding: 40px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.1);
            }
            
            .pdf-header {
                text-align: center;
                margin-bottom: 40px;
                padding-bottom: 20px;
                border-bottom: 3px solid #667eea;
            }
            
            .pdf-title {
                font-family: 'Kanit', sans-serif;
                font-size: 28px;
                font-weight: 700;
                color: #1a202c;
                margin-bottom: 10px;
            }
            
            .pdf-subtitle {
                font-size: 16px;
                color: #718096;
            }
            
            .pdf-section {
                margin-bottom: 30px;
            }
            
            .section-title {
                font-family: 'Kanit', sans-serif;
                font-size: 18px;
                font-weight: 600;
                color: #2d3748;
                margin-bottom: 15px;
                padding-bottom: 8px;
                border-bottom: 2px solid #e2e8f0;
            }
            
            .section-subtitle {
                font-size: 12px;
                color: #718096;
                margin-bottom: 10px;
                font-style: italic;
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .stat-card {
                background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
                border-radius: 12px;
                padding: 20px;
                text-align: center;
                border: 1px solid #e2e8f0;
            }
            
            .stat-value {
                font-family: 'Kanit', sans-serif;
                font-size: 24px;
                font-weight: 700;
                margin: 10px 0;
            }
            
            .stat-label {
                font-size: 12px;
                color: #718096;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .income { color: #10b981; }
            .expense { color: #ef4444; }
            .balance { color: #3b82f6; }
            .saving { color: #8b5cf6; }
            
            .table-container {
                max-height: 400px;
                overflow-y: auto;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                margin-top: 10px;
            }

            .table {
                width: 100%;
                border-collapse: collapse;
            }

            .table th {
                position: sticky;
                top: 0;
                background: #4c51bf;
                color: white;
                padding: 12px;
                text-align: left;
                font-weight: 500;
                z-index: 10;
            }

            .table td {
                padding: 12px;
                border-bottom: 1px solid #e2e8f0;
            }

.table tr:hover {
    background: #f7fafc;
}
            
            .badge {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;
            }
            
            .badge-success { background: #d1fae5; color: #065f46; }
            .badge-warning { background: #fef3c7; color: #92400e; }
            .badge-danger { background: #fee2e2; color: #991b1b; }
            
            .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 2px solid #e2e8f0;
                text-align: center;
                color: #718096;
                font-size: 12px;
            }
            
            .highlight {
                background: linear-gradient(120deg, #a78bfa 0%, #7c3aed 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                font-weight: 700;
            }
            
            .summary-box {
                background: #f8fafc;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 20px;
                border-left: 4px solid #4c51bf;
            }
            
            .summary-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
                font-size: 14px;
            }
            
            .summary-label {
                color: #64748b;
            }
            
            .summary-value {
                font-weight: 600;
                color: #1e293b;
            }
                .pie-chart-container {
    margin: 30px 0;
}

.css-pie-chart {
    position: relative;
    width: 250px;
    height: 250px;
    margin: 0 auto;
}

.pie-legend {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 300px;
    overflow-y: auto;
}

.legend-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background: white;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}

.legend-color {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    margin-right: 10px;
}

.legend-label {
    flex: 1;
    font-size: 13px;
}

.legend-value {
    font-size: 12px;
    color: #718096;
    min-width: 80px;
    text-align: right;
}

.pie-legend-scroll {
    max-height: 400px;
    overflow-y: auto;
    padding-right: 10px;
}

.pie-legend-scroll::-webkit-scrollbar {
    width: 6px;
}

.pie-legend-scroll::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
}

.pie-legend-scroll::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
}

.legend-item-compact {
    display: flex;
    align-items: center;
    padding: 8px 10px;
    margin-bottom: 6px;
    background: white;
    border-radius: 6px;
    border: 1px solid #f1f5f9;
    transition: all 0.2s;
}

.legend-item-compact:hover {
    background: #f8fafc;
    border-color: #e2e8f0;
}
        </style>
    </head>
    <body>
        <div class="pdf-container">
            <!-- Header -->
            <div class="pdf-header">
                <div class="pdf-title">📊 รายงานการเงิน Flow Wallet</div>
<div class="pdf-subtitle">
    ${data.month && data.year ? 
        `ประจำเดือน <span class="highlight">${data.month} ${data.year}</span>` :
        `ประจำช่วงเวลา <span class="highlight">${data.displayStartDate} - ${data.displayEndDate}</span>`
    }
</div>
                <div style="font-size: 12px; color: #a0aec0; margin-top: 5px;">
                    สร้างเมื่อ: ${data.reportDate}
                </div>
            </div>
            
            <!-- Summary Stats -->
            <div class="pdf-section">
                <div class="section-title">📈 สรุปภาพรวม</div>
                <div class="summary-box">
                    <div class="summary-item">
                        <span class="summary-label">รวมรายการทั้งหมด:</span>
                        <span class="summary-value">${data.transactionCount} รายการ</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">รายจ่ายทั้งหมด:</span>
                        <span class="summary-value">${data.expenseTransactionCount} รายการ</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">รายการที่มี TAG:</span>
                        <span class="summary-value">${data.taggedTransactionCount} รายการ</span>
                    </div>
                </div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-label">รายรับรวม</div>
                        <div class="stat-value income">฿${data.income.toLocaleString()}</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-label">รายจ่ายรวม</div>
                        <div class="stat-value expense">฿${data.expense.toLocaleString()}</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-label">ยอดคงเหลือ</div>
                        <div class="stat-value balance">฿${data.balance.toLocaleString()}</div>
                    </div>
                    
                    <div class="stat-card">
                            <div class="stat-label">อัตราการลงทุน</div>
                            <div class="stat-value saving">${data.investmentRate}%</div>
                        <div>
                            ${data.savingRate >= 20 ? 
                                '<span class="badge badge-success">ดีเยี่ยม</span>' : 
                                data.savingRate >= 10 ? 
                                '<span class="badge badge-warning">ปานกลาง</span>' : 
                                '<span class="badge badge-danger">ต้องปรับปรุง</span>'
                            }
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- All Categories -->
${data.categoryPieData && data.categoryPieData.labels.length > 0 ? `
<div class="pdf-section">
    <div class="section-title">🏷️ หมวดหมู่ทั้งหมดที่ใช้จ่าย</div>
    <div class="section-subtitle">
        แสดงทั้งหมด ${data.categoryPieData.labels.length} หมวดหมู่ (เรียงตามมูลค่ารวมจากมากไปน้อย)
    </div>
    
    <!-- เพิ่ม Pie Chart ที่นี่ -->
    ${createPieChartHTML(data.categoryPieData, 'สรุปหมวดหมู่ที่ใช้จ่าย')}
    
    <!-- ตารางเดิม (optional) -->
    <div style="margin-top: 30px;">
        <div class="section-subtitle">ตารางรายละเอียด</div>
        <div class="table-container">
            <table class="table">
                            <thead>
                                <tr>
                                    <th>หมวดหมู่</th>
                                    <th>จำนวนเงิน</th>
                                    <th>จำนวนรายการ</th>
                                    <th>สัดส่วนต่อรายจ่ายทั้งหมด</th>
                                </tr>
                            </thead>
                                <tbody>
                                    ${data.topCategories.map(cat => `
                                    <tr>
                                        <td>${cat.icon} ${cat.category}</td>
                                        <td><strong>฿${cat.amount.toLocaleString()}</strong></td>
                                        <td>${cat.count} รายการ</td>
                                        <td>${cat.percentage.toFixed(1)}%</td>
                                    </tr>
                                    `).join('')}
                                </tbody>
                        </table>
        </div>
    </div>
</div>
` : '<div class="pdf-section"><div class="section-title">🏷️ หมวดหมู่ที่ใช้จ่าย</div><p style="text-align: center; color: #718096; padding: 20px;">ไม่มีรายการรายจ่ายในหมวดหมู่สำหรับเดือนนี้</p></div>'}
            
            <!-- All Tags -->
${data.tagPieData && data.tagPieData.labels.length > 0 ? `
<div class="pdf-section">
    <div class="section-title">🏷️ TAG ที่ใช้ทั้งหมด</div>
    <div class="section-subtitle">
        แสดงทั้งหมด ${data.tagPieData.labels.length} TAG (เรียงตามมูลค่ารวมจากมากไปน้อย)
    </div>
    
    <!-- เพิ่ม Pie Chart ที่นี่ -->
    ${createPieChartHTML(data.tagPieData, 'สรุป TAG ที่ใช้')}
    
    <!-- ตารางเดิม (optional) -->
    <div style="margin-top: 30px;">
        <div class="section-subtitle">ตารางรายละเอียด</div>
        <div class="table-container">
            <table class="table">
                        <thead>
                            <tr>
                                <th>TAG</th>
                                <th>จำนวนเงิน</th>
                                <th>จำนวนรายการ</th>
                                <th>สัดส่วนต่อรายจ่ายทั้งหมด</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.topTags.map(tag => `
                            <tr>
                                <td><strong>#${tag.tag}</strong></td>
                                <td>฿${tag.amount.toLocaleString()}</td>
                                <td>${tag.count} รายการ</td>
                                <td>${tag.percentage.toFixed(1)}%</td>
                            </tr>
                            `).join('')}
                        </tbody>
                    </table>
        </div>
    </div>
</div>
` : '<div class="pdf-section"><div class="section-title">🏷️ TAG ที่ใช้</div><p style="text-align: center; color: #718096; padding: 20px;">ไม่มีรายการที่ใช้ TAG สำหรับเดือนนี้</p></div>'}
            
            <!-- Account Balances -->
            <div class="pdf-section">
                <div class="section-title">🏦 ยอดคงเหลือบัญชี</div>
                <div class="table-container">
    <table class="table">
                    <thead>
                        <tr>
                            <th>บัญชี</th>
                            <th>ยอดคงเหลือ</th>
                            <th>สถานะ</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.accounts.map(acc => `
                        <tr>
                            <td>${acc.icon} ${acc.name}</td>
                            <td><strong>฿${acc.balance.toLocaleString()}</strong></td>
                            <td>
                                ${acc.balance >= 0 ? 
                                    '<span class="badge badge-success">ปกติ</span>' : 
                                    '<span class="badge badge-danger">ติดลบ</span>'
                                }
                            </td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            ${data.debt && data.debt.debtCount > 0 ? createDebtReportHTML(data.debt) : ''}

            <!-- Recommendations -->
            <div class="pdf-section">
                <div class="section-title">💡 ข้อเสนอแนะ</div>
                <div style="background: #fefce8; padding: 20px; border-radius: 12px; border-left: 4px solid #f59e0b;">
                    ${getRecommendations(data)}
                </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <div>สร้างโดย Flow Wallet - แอปจัดการการเงินส่วนบุคคล</div>
                <div style="margin-top: 5px;">© ${new Date().getFullYear()} - รายงานนี้สร้างขึ้นอัตโนมัติ</div>
                <div style="margin-top: 5px; font-size: 10px; color: #cbd5e0;">
                    *ข้อมูล ณ วันที่สร้างรายงาน • รวมทั้งหมด ${data.transactionCount} รายการ
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
}


function getRecommendations(data) {
    const recommendations = [];
    
    if (data.savingRate < 0) {
        recommendations.push("🚨 <strong>คุณใช้งจ่ายเกินรายได้</strong> ควรควบคุมรายจ่ายหรือหารายได้เพิ่ม");
    }
    
    if (data.savingRate < 20) {
        recommendations.push("💰 <strong>อัตราการออมต่ำกว่าเป้าหมาย</strong> พยายามออมให้ได้อย่างน้อย 20% ของรายได้");
    }
    
    if (data.topCategories.length > 0) {
        data.topCategories.forEach(cat => {
            const percentage = parseFloat(cat.percentage);
            if (percentage > 30) {
                recommendations.push(`📊 <strong>${cat.category} ใช้งบประมาณ ${percentage.toFixed(1)}%</strong> ของรายจ่ายทั้งหมด พิจารณาลดค่าใช้จ่ายในหมวดนี้`);
            }
        });
    }
    
    if (data.topTags.length > 0) {
        data.topTags.forEach(tag => {
            const percentage = parseFloat(tag.percentage);
            if (percentage > 20) {
                recommendations.push(`🏷️ <strong>#${tag.tag} ใช้งบประมาณ ${percentage.toFixed(1)}%</strong> ของรายจ่ายทั้งหมด ควรทบทวนการใช้จ่ายใน TAG นี้`);
            }
        });
    }
    
    if (data.expenseTransactionCount === 0) {
        recommendations.push("📝 <strong>ไม่มีรายการรายจ่ายในเดือนนี้</strong> ตรวจสอบว่าบันทึกรายจ่ายครบถ้วนหรือไม่");
    }
    
    if (recommendations.length === 0) {
        recommendations.push("✅ <strong>การเงินอยู่ในเกณฑ์ดี</strong> รักษาวินัยทางการเงินอย่างนี้ต่อไป");
        if (data.taggedTransactionCount === 0) {
            recommendations.push("💡 <strong>เพิ่มการใช้ TAG</strong> เพื่อจัดกลุ่มรายจ่ายให้ละเอียดขึ้น");
        }
    }
    
    return recommendations.map(rec => `<div style="margin-bottom: 8px;">${rec}</div>`).join('');
}

function openDateRangeModal() {
    
    document.getElementById('reportStartDate').value = '';
    document.getElementById('reportEndDate').value = '';
    
    populateReportAccountSelect();
    
    document.getElementById('reportAccountSelect').value = reportDateRange.accountId || 'all';
    
    document.getElementById('selectedRangeDisplay').classList.add('hidden');
    
    setupDateInputListeners();
    
    document.getElementById('dateRangeModal').classList.remove('hidden');
    
    setTimeout(() => {
        document.getElementById('reportStartDate').focus();
    }, 300);
}

function populateReportAccountSelect() {
    const select = document.getElementById('reportAccountSelect');
    
    let optionsHTML = '<option value="all">📊 สรุปทุกบัญชี</option>';
    
    accounts.forEach(acc => {
        const balance = getAccountBalance(acc.id);
        optionsHTML += `
            <option value="${acc.id}">
                ${acc.icon} ${acc.name} (฿${balance.toLocaleString()})
            </option>
        `;
    });
    
    select.innerHTML = optionsHTML;
    
    if (reportDateRange.accountId) {
        select.value = reportDateRange.accountId;
    }
}

function setupDateInputListeners() {
    const startDateInput = document.getElementById('reportStartDate');
    const endDateInput = document.getElementById('reportEndDate');
    
    startDateInput.removeEventListener('change', handleDateChange);
    endDateInput.removeEventListener('change', handleDateChange);
    
    startDateInput.addEventListener('change', handleDateChange);
    endDateInput.addEventListener('change', handleDateChange);
}

function handleDateChange() {
    const startDate = document.getElementById('reportStartDate').value;
    const endDate = document.getElementById('reportEndDate').value;
    
    if (startDate || endDate) {
        updateDateRangeDisplay();
    }
    
}



function closeDateRangeModal() {
    document.getElementById('dateRangeModal').classList.add('hidden');
}



function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDateForDisplay(date) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(date).toLocaleDateString('th-TH', options);
}

function setDateRange(rangeType) {
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();
    
    switch(rangeType) {
        case 'thisMonth':
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            break;
        case 'lastMonth':
            startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            endDate = new Date(today.getFullYear(), today.getMonth(), 0);
            break;
        case 'last3Months':
            startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
            endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            break;
        case 'thisYear':
            startDate = new Date(today.getFullYear(), 0, 1);
            endDate = new Date(today.getFullYear(), 11, 31);
            break;
        case 'custom':
            break;
    }
    
    document.getElementById('reportStartDate').value = formatDateForInput(startDate);
    document.getElementById('reportEndDate').value = formatDateForInput(endDate);

    const accountId = document.getElementById('reportAccountSelect').value;
    
    updateDateRangeDisplay();
}



function clearDateRange() {
    document.getElementById('reportStartDate').value = '';
    document.getElementById('reportEndDate').value = '';
    
    reportDateRange = {
        startDate: null,
        endDate: null,
        accountId: 'all', 
        isCustomRange: false
    };
    
    document.getElementById('reportAccountSelect').value = 'all';
    
    document.getElementById('selectedRangeDisplay').classList.add('hidden');
    
    setTimeout(() => {
        document.getElementById('reportStartDate').focus();
    }, 100);
    
    showToast("🗑️ เคลียร์ช่วงเวลาที่เลือกแล้ว");
}

function updateDateRangeDisplay() {
    const startDate = document.getElementById('reportStartDate').value;
    const endDate = document.getElementById('reportEndDate').value;
    
    if (startDate && endDate) {
        document.getElementById('displayStartDate').textContent = formatDateForDisplay(startDate);
        document.getElementById('displayEndDate').textContent = formatDateForDisplay(endDate);
        document.getElementById('selectedRangeDisplay').classList.remove('hidden');
    }
}

function confirmDateRange() {
    const startDate = document.getElementById('reportStartDate').value;
    const endDate = document.getElementById('reportEndDate').value;
    const accountId = document.getElementById('reportAccountSelect').value;
    
    if (!startDate || !endDate) {
        showToast("กรุณาเลือกทั้งวันที่เริ่มต้นและสิ้นสุด");
        return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
        showToast("วันที่เริ่มต้นต้องมาก่อนวันที่สิ้นสุด");
        return;
    }
    
    reportDateRange = {
        startDate: startDate,
        endDate: endDate,
        accountId: accountId,
        isCustomRange: true
    };
    
    closeDateRangeModal();
    
    setTimeout(() => {
        generatePDFReportWithRangeAuto();
    }, 500);
}

async function generatePDFReportWithRange() {
    if (!reportDateRange.startDate || !reportDateRange.endDate) {
        openDateRangeModal();
    } else {
        await generatePDFReportWithRangeAuto();
    }
}

async function createHTMLReportWithDateRange(startDateStr, endDateStr, accountId = 'all') {
    const reportData = await gatherReportDataByDateRange(startDateStr, endDateStr, accountId);
    const htmlContent = createPDFHTMLWithDateRange(reportData, startDateStr, endDateStr, accountId);
    await downloadHTMLFile(htmlContent, reportData);
    
    showToast('✅ สร้างรายงาน HTML สำเร็จ');
        setTimeout(() => {
            refreshUIAfterReport();
        }, 500);
}

async function generatePDFReportWithRangeAuto() {
    if (!reportDateRange.startDate || !reportDateRange.endDate) {
        showToast("📅 กรุณาเลือกช่วงเวลาก่อนสร้างรายงาน");
        openDateRangeModal();
        return;
    }
    
    try {
        if (!document.getElementById('settingsModal').classList.contains('hidden')) {
            toggleSettingsModal();
        }
        
        const accountName = reportDateRange.accountId === 'all' ? 'ทุกบัญชี' : getAccountById(reportDateRange.accountId)?.name;
        showToast(`🔄 กำลังสร้างรายงานตามช่วงเวลา (บัญชี: ${accountName})...`);
        
        await createHTMLReportWithDateRange(reportDateRange.startDate, reportDateRange.endDate, reportDateRange.accountId);
        
    } catch (error) {
        console.error('Error generating report with date range:', error);
        showToast('❌ สร้างรายงานไม่สำเร็จ: ' + error.message);
    }
}

function refreshUIAfterReport() {
    console.log("🔄 รีเฟรช UI หลังสร้างรายงาน...");
    
    try {
        reportDateRange = {
            startDate: null,
            endDate: null,
            isCustomRange: false
        };
        
        const currentPage = getCurrentPage();
        
        switch(currentPage) {
            case 'overview':
                updateUI();
                renderCalendar();
                break;
                
            case 'budget':
                updateBudgetUI();
                break;
                
            case 'analysis':
                if (reportDateRange.startDate) {
                    const startDate = new Date(reportDateRange.startDate);
                    analysisDate = startDate;
                    updateAnalysisPeriodText();
                }
                refreshAnalysisCharts();
                break;
                
            case 'yearly':
                if (reportDateRange.startDate) {
                    const startDate = new Date(reportDateRange.startDate);
                    displayYear = startDate.getFullYear();
                    document.getElementById('yearSelect').value = displayYear;
                }
                updateYearlyUI();
                break;
                
            case 'debt':
                renderDebtPage();
                break;
                
            case 'accounts':
                renderAccountsList();
                break;
        }
        
        updateAccountFilterDropdown();
        
        updateAllAccountIndicators();
        
        if (financeDB && financeDB.loadInitialData) {
            setTimeout(() => {
                financeDB.loadInitialData();
            }, 500);
        }
        
        showToast("✅ รายงานสร้างสำเร็จและรีเฟรชข้อมูลแล้ว");
        
        console.log("✅ รีเฟรช UI เสร็จสิ้น");
        
    } catch (error) {
        console.error("❌ เกิดข้อผิดพลาดในการรีเฟรช UI:", error);
    }
}

async function generatePDFReport() {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    try {
        toggleSettingsModal();
        
        showToast("🔄 กำลังสร้างรายงานเดือนปัจจุบัน...");
        
        await createHTMLReportWithDateRange(formatDateForInput(startDate), formatDateForInput(endDate));

        setTimeout(() => {
            refreshUIAfterReport();
        }, 1000);
        
    } catch (error) {
        console.error('Error generating report:', error);
        showToast('❌ สร้างรายงานไม่สำเร็จ: ' + error.message);
    }
}

async function gatherReportDataByDateRange(startDateStr, endDateStr, accountId = 'all') {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    
    let filteredTransactions = transactions.filter(t => {
        const txDate = new Date(t.rawDate);
        return txDate >= startDate && txDate <= endDate;
    });
    
    if (accountId !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => 
            t.accountId === accountId || 
            (t.type === 'transfer' && t.transferToAccountId === accountId)
        );
    }
    
    const income = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;
    
    const investmentExpense = filteredTransactions
        .filter(t => t.type === 'expense' && 
               customCategories.investment.some(c => c.label === t.category))
        .reduce((sum, t) => sum + t.amount, 0);

    const investmentRate = income > 0 ? (investmentExpense / income) * 100 : 0;
    
    let accountsBalance = [];
    if (accountId === 'all') {
        accountsBalance = accounts.map(acc => ({
            name: acc.name,
            balance: getAccountBalance(acc.id),
            icon: acc.icon
        }));
    } else {
        const selectedAccount = getAccountById(accountId);
        if (selectedAccount) {
            accountsBalance = [{
                name: selectedAccount.name,
                balance: getAccountBalance(accountId),
                icon: selectedAccount.icon
            }];
        }
    }
    
    const spendingByCategory = {};
    const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');
    
    expenseTransactions.forEach(t => {
        if (!spendingByCategory[t.category]) {
            spendingByCategory[t.category] = { 
                amount: 0, 
                count: 0, 
                icon: t.icon,
                percentage: 0
            };
        }
        spendingByCategory[t.category].amount += t.amount;
        spendingByCategory[t.category].count++;
    });
    
    Object.keys(spendingByCategory).forEach(category => {
        spendingByCategory[category].percentage = expense > 0 ? 
            (spendingByCategory[category].amount / expense) * 100 : 0;
    });
    
    const allCategories = Object.entries(spendingByCategory)
        .map(([category, data]) => ({ 
            category, 
            ...data 
        }))
        .sort((a, b) => b.amount - a.amount);
    
    const spendingByTag = {};
    const taggedTransactions = expenseTransactions.filter(t => t.tag && t.tag.trim() !== '');
    
    taggedTransactions.forEach(t => {
        const tag = t.tag.trim();
        if (!spendingByTag[tag]) {
            spendingByTag[tag] = { 
                amount: 0, 
                count: 0,
                percentage: 0
            };
        }
        spendingByTag[tag].amount += t.amount;
        spendingByTag[tag].count++;
    });
    
    Object.keys(spendingByTag).forEach(tag => {
        spendingByTag[tag].percentage = expense > 0 ? 
            (spendingByTag[tag].amount / expense) * 100 : 0;
    });
    
    const allTags = Object.entries(spendingByTag)
        .map(([tag, data]) => ({ 
            tag, 
            ...data 
        }))
        .sort((a, b) => b.amount - a.amount);

    const debtData = await getDebtReportDataByDateRange(startDateStr, endDateStr);
    
    return {
        startDate: startDateStr,
        endDate: endDateStr,
        displayStartDate: formatDateForDisplay(startDateStr),
        displayEndDate: formatDateForDisplay(endDateStr),
        accountId: accountId,
        accountName: accountId === 'all' ? 'ทุกบัญชี' : getAccountById(accountId)?.name,
        reportDate: new Date().toLocaleDateString('th-TH'),
        
        income,
        expense,
        balance,
        investmentRate: investmentRate.toFixed(1),
        transactionCount: filteredTransactions.length,
        expenseTransactionCount: expenseTransactions.length,
        taggedTransactionCount: taggedTransactions.length,
        debt: debtData,
        
        accounts: accountsBalance,
        totalBalance: calculateTotalBalance(),
        
        topCategories: allCategories,
        topTags: allTags,
        
        categoryPieData: {
            labels: allCategories.map(cat => cat.category),
            data: allCategories.map(cat => cat.amount),
            colors: generateChartColors(allCategories.length)
        },
        tagPieData: {
            labels: allTags.map(tag => tag.tag),
            data: allTags.map(tag => tag.amount),
            colors: generateChartColors(allTags.length)
        }
    };
}

async function getDebtReportDataByDateRange(startDateStr, endDateStr) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    
    const rangeDebts = debts.filter(debt => {
        const debtStartDate = new Date(debt.startDate);
        return debtStartDate >= startDate && debtStartDate <= endDate;
    });
    
    let totalDebt = 0;
    let totalPaid = 0;
    let activeDebts = 0;
    
    rangeDebts.forEach(debt => {
        totalDebt += debt.totalAmount;
        const debtPayments = payments.filter(p => p.debtId === debt.id);
        const paidAmount = debtPayments.reduce((sum, p) => sum + p.amount, 0);
        totalPaid += paidAmount;
        if (debt.totalAmount - paidAmount > 0) activeDebts++;
    });
    
    return {
        totalDebt,
        totalPaid,
        remaining: totalDebt - totalPaid,
        debtCount: rangeDebts.length,
        activeDebts,
        utilization: totalDebt > 0 ? (totalPaid / totalDebt) * 100 : 0,
        debts: rangeDebts.slice(0, 5)
    };
}

function createPDFHTMLWithDateRange(data, startDateStr, endDateStr, accountId = 'all') {
    const html = createPDFHTML(data);
    
    const accountInfo = accountId === 'all' ? 
        'ทุกบัญชี' : 
        `บัญชี: ${getAccountById(accountId)?.name || accountId}`;
    
    return html
        .replace(
            'ประจำเดือน <span class="highlight">${data.month} ${data.year}</span>',
            `ประจำช่วงเวลา <span class="highlight">${data.displayStartDate} - ${data.displayEndDate}</span>`
        )
        .replace(
            'สรุปภาพรวม',
            `สรุปภาพรวม (${accountInfo})`
        )
        .replace(
            '📊 รายงานการเงิน Flow Wallet',
            `📊 รายงานการเงิน Flow Wallet - ${accountInfo}`
        );
}


let isLoggedIn = false;
let currentUser = null;

let saveToLocalEnabled = true;



function handleCheckboxChange(e) {
    saveToLocalEnabled = e.target.checked;
    localStorage.setItem('fin_save_local_preference', e.target.checked);
    

    const desktopCheckbox = document.getElementById('saveToLocalCheckbox');
    const mobileCheckbox = document.getElementById('mobileSaveToLocalCheckbox');
    
    if (desktopCheckbox && desktopCheckbox !== e.target) {
        desktopCheckbox.checked = e.target.checked;
    }
    if (mobileCheckbox && mobileCheckbox !== e.target) {
        mobileCheckbox.checked = e.target.checked;
    }
    

    if (window.financeDB) {
        window.financeDB.setSaveToLocalEnabled(saveToLocalEnabled);
    }
    
    console.log('📌 Checkbox changed:', e.target.checked, 'saveToLocalEnabled =', saveToLocalEnabled);
    
    showToast(saveToLocalEnabled ? 
        '✅ บันทึกทั้ง MySQL และเครื่อง' : 
        '☁️ บันทึกเฉพาะ MySQL (ไม่เก็บในเครื่อง)', 'info');
}

function updateLocalSaveCheckbox() {
    const isLoggedInUser = !!(localStorage.getItem('user'));
    
    const desktopCheckbox = document.getElementById('saveToLocalCheckbox');
    const mobileCheckbox = document.getElementById('mobileSaveToLocalCheckbox');
    const hint = document.getElementById('localSaveHint');
    const mobileHint = document.getElementById('mobileLocalSaveHint');
    
    if (desktopCheckbox) {
        if (!isLoggedInUser) {
            desktopCheckbox.checked = true;
            desktopCheckbox.disabled = true;
            saveToLocalEnabled = true;
            if (hint) {
                hint.innerHTML = '🔒 บังคับบันทึกในเครื่อง (โหมดผู้เยี่ยมชม)';
                hint.className = 'text-[10px] text-amber-500 mt-0.5';
            }
        } else {
            desktopCheckbox.disabled = false;
            
            const savedPreference = localStorage.getItem('fin_save_local_preference');
            
            if (savedPreference === null) {
                desktopCheckbox.checked = false;
                saveToLocalEnabled = false;
                localStorage.setItem('fin_save_local_preference', 'false');
            } else {
                desktopCheckbox.checked = savedPreference === 'true';
                saveToLocalEnabled = desktopCheckbox.checked;
            }
            
            if (hint) {
                hint.innerHTML = '💡 ถ้าไม่ติ๊ก จะบันทึกเฉพาะบนเซิร์ฟเวอร์ (MySQL)';
                hint.className = 'text-[10px] text-slate-400 mt-0.5';
            }
            
            desktopCheckbox.removeEventListener('change', handleCheckboxChange);
            desktopCheckbox.addEventListener('change', handleCheckboxChange);
        }
    }
    
    if (mobileCheckbox) {
        if (!isLoggedInUser) {
            mobileCheckbox.checked = true;
            mobileCheckbox.disabled = true;
            if (mobileHint) {
                mobileHint.innerHTML = '🔒 บังคับบันทึกในเครื่อง (โหมดผู้เยี่ยมชม)';
                mobileHint.className = 'text-[10px] text-amber-500 mt-0.5';
            }
        } else {
            mobileCheckbox.disabled = false;
            
            const savedPreference = localStorage.getItem('fin_save_local_preference');
            
            if (savedPreference === null) {
                mobileCheckbox.checked = false;
                saveToLocalEnabled = false;
                localStorage.setItem('fin_save_local_preference', 'false');
            } else {
                mobileCheckbox.checked = savedPreference === 'true';
                saveToLocalEnabled = mobileCheckbox.checked;
            }
            
            if (mobileHint) {
                mobileHint.innerHTML = '💡 ถ้าไม่ติ๊ก จะบันทึกเฉพาะบนเซิร์ฟเวอร์ (MySQL)';
                mobileHint.className = 'text-[10px] text-slate-400 mt-0.5';
            }
            
            mobileCheckbox.removeEventListener('change', handleCheckboxChange);
            mobileCheckbox.addEventListener('change', handleCheckboxChange);
        }
    }
    
    if (window.financeDB) {
        window.financeDB.setSaveToLocalEnabled(saveToLocalEnabled);
    }
    
    console.log(`💾 saveToLocalEnabled = ${saveToLocalEnabled}`);
}

async function cleanupLocalCache() {
    if (!isLoggedIn) return;
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('fin_cache_')) {
            localStorage.removeItem(key);
            console.log(`🗑️ ลบ ${key}`);
        }
    }
    
    localStorage.removeItem('fin_cache_recent');
    
    const allTx = JSON.parse(localStorage.getItem('fin_tx_v5') || '[]');
    const backendTx = allTx.filter(t => t.backendId);
    localStorage.setItem('fin_tx_v5', JSON.stringify(backendTx));
    
    console.log(`✅ ล้าง cache เสร็จ: เหลือ ${backendTx.length} รายการใน fin_tx_v5`);
}




function injectLocalSaveCheckbox() {
    if (document.getElementById('localSaveOption')) return;
    
    const formContainer = document.getElementById('formContainer');
    if (!formContainer) {
        console.log('⚠️ ไม่พบ formContainer');
        return;
    }
    
    const submitBtn = document.getElementById('submitBtn');
    if (!submitBtn) {
        console.log('⚠️ ไม่พบ submitBtn');
        return;
    }
    
    const checkboxHTML = `
        <div id="localSaveOption" class="mt-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
            <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" 
                       id="saveToLocalCheckbox" 
                       class="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                       checked>
                <div class="flex-1">
                    <span class="text-sm font-bold dark:text-white">💾 บันทึกลงเครื่อง (Local + IndexedDB)</span>
                    <p id="localSaveHint" class="text-[10px] text-slate-400 mt-0.5">
                        ข้อมูลจะถูกเก็บในเครื่องเพื่อใช้งานแบบออฟไลน์
                    </p>
                </div>
            </label>
        </div>
    `;
    
    submitBtn.insertAdjacentHTML('beforebegin', checkboxHTML);
    console.log('✅ แทรก checkbox สำเร็จ');
    
    if (typeof updateLocalSaveCheckbox === 'function') {
        updateLocalSaveCheckbox();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(injectLocalSaveCheckbox, 1500);
});

const originalManageFormContainer = manageFormContainer;
manageFormContainer = function() {
    originalManageFormContainer();
    setTimeout(injectLocalSaveCheckbox, 500);
};

document.addEventListener('DOMContentLoaded', function() {
    const savedUser = localStorage.getItem('user');
    
    try {
        if (savedUser && savedUser !== 'null' && savedUser !== 'undefined') {
            currentUser = JSON.parse(savedUser);
            isLoggedIn = true;
            console.log('🔐 User logged in:', currentUser.username);
            
            if (typeof loadUserDataFromBackend === 'function') {
                loadUserDataFromBackend();
            }
        } else {
            isLoggedIn = false;
            currentUser = { id: 'guest_' + Date.now() };
            console.log('👤 Guest mode');
            
        }
    } catch (e) {
        console.error('❌ Error parsing user:', e);
        localStorage.removeItem('user');
        isLoggedIn = false;
        currentUser = { id: 'guest_' + Date.now() };
    }
    
    updateAuthButtons();
});

function checkLoginStatus() {
    const user = localStorage.getItem('user');
    updateAuthButtons(); 
    
    if (user) {
        isLoggedIn = true;
        currentUser = JSON.parse(user);
        return true;
    } else {
        isLoggedIn = false;
        currentUser = { id: 'guest_' + Date.now() };
        return false;
    }
}

function showAuthSection() {
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('app-content').style.display = 'none';
    showLogin(); 
}

function showAppContent() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('app-content').style.display = 'block';
    
    addLogoutButton();
}

function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
}

function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

function addLogoutButton() {
    if (!document.getElementById('logout-btn')) {
        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'logout-btn';
        logoutBtn.onclick = logout;
        document.body.appendChild(logoutBtn);
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    
    if (type === 'success') {
        toast.className = 'fixed top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-bold z-[9999] transition-all duration-300';
    } else if (type === 'error') {
        toast.className = 'fixed top-4 left-1/2 -translate-x-1/2 bg-rose-600 text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-bold z-[9999] transition-all duration-300';
    } else if (type === 'info') {
        toast.className = 'fixed top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-bold z-[9999] transition-all duration-300';
    }
    
    toast.innerText = message;
    toast.style.display = 'block';
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    
    setTimeout(() => { 
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 300);
    }, 2000);
}

const API_URL = 'https://expense-tracker-backend-ek2d.onrender.com/api';

async function login() {
    try {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        if (!username || !password) {
            showToast('⚠️ กรุณากรอกชื่อผู้ใช้และรหัสผ่าน', 'error');
            return;
        }
        
        showToast('🔄 กำลังเข้าสู่ระบบ...', 'info');
        
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // ลบข้อมูล user เก่า
            if (currentUser?.id) {
                const allTx = await financeDB.getAllTransactions();
                const oldUserTx = allTx.filter(t => t.owner_type === 'user' && t.owner_id === currentUser.id);
                for (const tx of oldUserTx) {
                    await financeDB.deleteTransaction(tx.id);
                }
            }
            
            localStorage.setItem('user', JSON.stringify(data.user));
            isLoggedIn = true;
            currentUser = data.user;
            
            hideLoginModal();
            updateAuthButtons();
            
            // ✅ โหลด checkbox state
            updateLocalSaveCheckbox();
            
            showToast('🔄 กำลังโหลดข้อมูล...', 'info');
            
            // ✅ โหลดข้อมูลทั้งหมดจาก MySQL
            await Promise.all([
                loadAccountsFromBackend(),
                loadCategoriesFromBackend(),
                loadTransactionsFromBackend(),
                loadDebtsFromBackend(),      // ✅ เพิ่ม
                loadPaymentsFromBackend()    // ✅ เพิ่ม
            ]);
            
            transactions = backendTransactions;
            
            // ✅ อัปเดต UI
            updateAccountSelect();
            updateMobileAccountSelect();
            updateCategorySelect();
            updateUI();
            renderCalendar();
            renderAccountsList();
            
            // ✅ รีเฟรชหน้าปัจจุบัน
            const currentPage = getCurrentPage();
            switch(currentPage) {
                case 'budget': updateBudgetUI(); break;
                case 'analysis': refreshAnalysisCharts(); break;
                case 'yearly': updateYearlyUI(); break;
                case 'debt': renderDebtPage(); break;
                case 'accounts': renderAccountsList(); break;
            }
            
            showToast('✅ เข้าสู่ระบบสำเร็จ!', 'success');
            
        } else {
            showToast('❌ ' + (data.error || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'), 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('❌ เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
    }
}



async function loadUserDataFromBackend() {
    console.log('🚀 loadUserDataFromBackend START');
    if (!isLoggedIn || !navigator.onLine) {
        console.log('⏳ ไม่สามารถโหลดข้อมูลได้ (ไม่มีเน็ตหรือยังไม่ login)');
        return;
    }
    
    showToast('🔄 กำลังโหลดข้อมูลจากเซิร์ฟเวอร์...', 'info');
    
    try {
        try {
            await loadTransactionsFromBackend();
        } catch (e) {
            console.error('Error loading transactions:', e);
        }
        
        try {
            await loadAccountsFromBackend();
        } catch (e) {
            console.error('Error loading accounts:', e);
        }
        
        try {
            await loadCategoriesFromBackend();
        } catch (e) {
            console.error('Error loading categories:', e);
        }
        
        try {
            await loadBudgetsFromBackend();
        } catch (e) {
            console.error('Error loading budgets:', e);
        }
        
        try {
            await loadDebtsFromBackend();
        } catch (e) {
            console.error('Error loading debts:', e);
        }
        
        try {
            await loadTagsFromBackend();
        } catch (e) {
            console.error('Error loading tags:', e);
        }
        
        showToast('✅ โหลดข้อมูลจากเซิร์ฟเวอร์สำเร็จ', 'success');
        
        updateUI();
        
    } catch (error) {
        console.error('Error loading user data:', error);
        showToast('⚠️ โหลดข้อมูลบางส่วนไม่สำเร็จ', 'info');
    }
}

async function loadTransactionsFromBackend() {
    if (!isLoggedIn || !navigator.onLine) return;
    
    try {
        console.log('📥 กำลังโหลด transactions จาก backend...');
        const response = await fetch(`${API_URL}/transactions/${currentUser.id}`);
        
        if (!response.ok) {
            console.error('Backend returned error:', response.status);
            return;
        }
        
        const serverTransactions = await response.json();
        console.log(`📦 ข้อมูลจาก backend: ${serverTransactions.length} รายการ`);
        
        backendTransactions = [];
        
        for (const tx of serverTransactions) {
            if (!tx || !tx.id) continue;
            
            // ✅ Debug: แสดงค่าที่ได้รับ
            console.log(`🔍 Transaction ${tx.id}: isDebtPayment=${tx.isDebtPayment}, originalPaymentId=${tx.originalPaymentId}`);
            
            const formattedTx = {
                id: tx.id.toString(),
                amount: parseFloat(tx.amount) || 0,
                type: tx.type || 'expense',
                category: tx.category || 'อื่นๆ',
                icon: tx.icon || '📝',
                desc: tx.desc || tx.category || '',
                tag: tx.tag || '',
                rawDate: tx.rawDate || tx.date || '',
                monthKey: tx.monthKey || '',
                date: tx.date || tx.rawDate || '',
                accountId: tx.accountId,
                transferToAccountId: tx.transferToAccountId || null,
                transferFromAccountId: tx.transferFromAccountId || null,
                transferType: tx.transferType || null,
                isInitialBalance: tx.isInitialBalance || false,
                isDebtPayment: tx.isDebtPayment || false,           // ✅ สำคัญ!
                originalDebtId: tx.originalDebtId || null,          // ✅ สำคัญ!
                originalPaymentId: tx.originalPaymentId || null,    // ✅ สำคัญ!
                backendId: tx.id,
                isFromBackend: true,
                createdAt: tx.createdAt || new Date().toISOString(),
                updatedAt: tx.updatedAt || new Date().toISOString(),
                owner_type: 'user',
                owner_id: currentUser.id
            };
            
            backendTransactions.push(formattedTx);
        }

        transactions = backendTransactions;
        
        console.log(`✅ โหลดข้อมูลจาก backend สำเร็จ: ${backendTransactions.length} รายการ`);
        console.log(`🔍 Sample transaction:`, transactions[0]);  // ✅ เพิ่ม debug
        
        // รีเฟรช UI
        updateUI();
        renderCalendar();
        
        const currentPage = getCurrentPage();
        if (currentPage === 'accounts') {
            renderAccountsList();
        }
        switch(currentPage) {
            case 'budget':
                updateBudgetUI();
                break;
            case 'analysis':
                refreshAnalysisCharts();
                break;
            case 'yearly':
                updateYearlyUI();
                if (document.getElementById('y-tab-tags').classList.contains('active')) {
                    updateYearlyTagsUI();
                }
                break;
            case 'debt':
                renderDebtPage();
                break;
            case 'accounts':
                renderAccountsList();
                break;
        }
        
    } catch (error) {
        console.error('Error loading transactions from backend:', error);
    }
}
function findTransactionById(id) {
    let tx = transactions.find(t => t.id === id);
    
    if (!tx && backendTransactions && backendTransactions.length > 0) {
        tx = backendTransactions.find(t => t.id === id);
    }
    
    return tx;
}


async function syncMySQLtoLocal() {
    if (!isLoggedIn) {
        showToast('⚠️ กรุณาเข้าสู่ระบบก่อน', 'error');
        return;
    }
    
    if (!navigator.onLine) {
        showToast('📱 ไม่มีอินเทอร์เน็ต, ไม่สามารถซิงค์ได้', 'error');
        return;
    }
    
    const saveToLocalCheckbox = document.getElementById('saveToLocalCheckbox');
    const isSaveToLocalEnabled = saveToLocalCheckbox ? saveToLocalCheckbox.checked : false;
    
    if (!isSaveToLocalEnabled) {
        showToast('⚠️ กรุณาตี๊ก "บันทึกลงเครื่อง" ก่อนซิงค์', 'info');
        return;
    }
    
    showToast('🔄 กำลังซิงค์ข้อมูลจาก MySQL ลงเครื่อง...', 'info');
    
    try {
        const response = await fetch(`${API_URL}/transactions/${currentUser.id}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const serverTransactions = await response.json();
        
        if (!Array.isArray(serverTransactions)) {
            throw new Error('ข้อมูลไม่ถูกต้อง');
        }
        
        let savedCount = 0;
        let errorCount = 0;
        
        for (const tx of serverTransactions) {
            try {
                const formattedTx = {
                    id: tx.id.toString(),
                    amount: parseFloat(tx.amount) || 0,
                    type: tx.type || 'expense',
                    category: tx.category || 'อื่นๆ',
                    icon: tx.icon || '📝',
                    desc: tx.desc || tx.category || '',
                    tag: tx.tag || '',
                    rawDate: tx.rawDate || tx.date || '',
                    monthKey: tx.monthKey || '',
                    date: tx.date || tx.rawDate || '',
                    accountId: tx.accountId ? tx.accountId.toString() : null,
                    backendId: tx.id,
                    isFromBackend: true,
                    createdAt: tx.createdAt || new Date().toISOString(),
                    updatedAt: tx.updatedAt || new Date().toISOString(),
                    owner_type: 'user',
                    owner_id: currentUser.id
                };
                
                await financeDB.saveTransaction(formattedTx);
                savedCount++;
                
                if (savedCount % 50 === 0) {
                    showToast(`🔄 ซิงค์... ${savedCount}/${serverTransactions.length}`);
                }
                
            } catch (txError) {
                console.error('❌ บันทึก transaction ล้มเหลว:', txError);
                errorCount++;
            }
        }
        
        await loadInitialData();
        updateUI();
        renderCalendar();
        refreshAnalysisCharts();
        
        showToast(`✅ ซิงค์สำเร็จ: ${savedCount} รายการ (ผิดพลาด ${errorCount})`, 'success');
        
    } catch (error) {
        console.error('❌ ซิงค์ล้มเหลว:', error);
        showToast(`❌ ซิงค์ไม่สำเร็จ: ${error.message}`, 'error');
    }
}

async function loadAccountsFromBackend() {
    if (!isLoggedIn || !navigator.onLine) return;
    
    try {
        const response = await fetch(`${API_URL}/accounts/${currentUser.id}`);
        
        if (!response.ok) {
            console.warn('Failed to load accounts from backend');
            return;
        }
        
        const serverAccounts = await response.json();
        
        if (serverAccounts.length > 0) {
            accounts = serverAccounts.map(acc => ({
                id: acc.id,
                name: acc.name,
                type: acc.type,
                icon: acc.icon,
                initialBalance: acc.initialBalance || 0,  // ✅ ต้องมี
                isDefault: acc.isDefault || false,
                createdAt: acc.createdAt,
                updatedAt: acc.updatedAt
            }));
            
            const defaultAccount = accounts.find(a => a.isDefault);
            if (defaultAccount) {
                currentAccountId = defaultAccount.id;
                localStorage.setItem('fin_current_account', currentAccountId);
            } else if (accounts.length > 0) {
                currentAccountId = accounts[0].id;
            }
            
            saveAccounts();
            
            console.log(`✅ โหลด ${accounts.length} accounts จาก backend`);
        } else {
            console.log('⚠️ ไม่มี accounts จาก backend');
        }
        
    } catch (error) {
        console.error('Error loading accounts:', error);
    }
}

async function loadCategoriesFromBackend() {
    if (!isLoggedIn || !navigator.onLine) return;
    
    try {
        const response = await fetch(`${API_URL}/categories/${currentUser.id}`);
        
        if (!response.ok) {
            console.warn('Failed to load categories from backend');
            return;
        }
        
        const serverCategories = await response.json();
        
        // ✅ ตรวจสอบว่ามีข้อมูลหรือไม่
        if (serverCategories && 
            (serverCategories.income?.length > 0 ||
             serverCategories.spending?.length > 0 ||
             serverCategories.investment?.length > 0)) {
            
            customCategories = {
                income: serverCategories.income || [],
                spending: serverCategories.spending || [],
                investment: serverCategories.investment || []
            };
            
            // ✅ บันทึกลง localStorage
            localStorage.setItem('fin_custom_cats', JSON.stringify(customCategories));
            
            console.log(`✅ โหลด categories จาก backend:`, {
                income: customCategories.income.length,
                spending: customCategories.spending.length,
                investment: customCategories.investment.length
            });
        } else {
            console.log('⚠️ ไม่มี categories จาก backend, ใช้ default');
            customCategories = JSON.parse(JSON.stringify(defaultCategories));
        }
        
        updateCategorySelect();
        
    } catch (error) {
        console.error('Error loading categories:', error);
        customCategories = JSON.parse(JSON.stringify(defaultCategories));
    }
}

async function loadTagsFromBackend() {
    if (!isLoggedIn || !navigator.onLine) return;
    
    try {
        const response = await fetch(`${API_URL}/tags/${currentUser.id}`);
        const serverTags = await response.json();
        
        console.log(`📥 โหลด ${serverTags.length} tags จาก backend`);
        
        for (const tag of serverTags) {
            const exists = tags.some(t => t.id === tag.id);
            if (!exists) {
                tags.push({
                    id: tag.id.toString(),
                    name: tag.name,
                    color: tag.color || '#6366f1'
                });
            }
        }
        
        localStorage.setItem('fin_tags', JSON.stringify(tags));
        
    } catch (error) {
        console.error('Error loading tags:', error);
    }
}

async function saveTagToBackend(tagData) {
    if (!isLoggedIn || !navigator.onLine) return false;
    
    try {
        const response = await fetch(`${API_URL}/tags`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUser.id,
                name: tagData.name,
                color: tagData.color || '#6366f1'
            })
        });
        
        const result = await response.json();
        
        if (response.ok && result.id && tagData.id.startsWith('tag_')) {
            tagData.id = result.id.toString();
            localStorage.setItem('fin_tags', JSON.stringify(tags));
        }
        
        return response.ok;
    } catch (error) {
        console.error('Error saving tag:', error);
        return false;
    }
}

async function deleteTagFromBackend(tagId) {
    if (!isLoggedIn || !navigator.onLine) return false;
    
    if (tagId.toString().startsWith('tag_')) return true;
    
    try {
        const response = await fetch(`${API_URL}/tags/${tagId}?user_id=${currentUser.id}`, {
            method: 'DELETE'
        });
        
        return response.ok;
    } catch (error) {
        console.error('Error deleting tag:', error);
        return false;
    }
}

async function loadBudgetsFromBackend() {
    try {
        const monthKey = getMonthKey();
        const response = await fetch(`${API_URL}/budgets/${currentUser.id}/${monthKey}`);
        const serverBudgets = await response.json();
        
        console.log(`📥 โหลด budgets จาก backend`);
        
        categoryTargets[monthKey] = serverBudgets;
        localStorage.setItem('fin_targets_v5', JSON.stringify(categoryTargets));
        
    } catch (error) {
        console.error('Error loading budgets:', error);
        throw error;
    }
}



async function loadDebtsFromBackend() {
    console.log('🚀 loadDebtsFromBackend START, currentUser.id =', currentUser?.id);
    console.log('🚀 loadDebtsFromBackend START, saveToLocalEnabled =', saveToLocalEnabled);
    
    try {
        const response = await fetch(`${API_URL}/debts/${currentUser.id}`);
        const serverDebts = await response.json();
        
        console.log(`📥 โหลด ${serverDebts.length} debts จาก backend`);
        console.log('📥 serverDebts:', serverDebts);
        
        for (const debt of serverDebts) {
            const exists = debts.some(d => d.id === debt.id);
            if (!exists) {
                debts.push(debt);
                console.log(`✅ เพิ่ม debt: ${debt.name} (${debt.id})`);
            } else {
                console.log(`⏭️ debt มีอยู่แล้ว: ${debt.name} (${debt.id})`);
            }
        }
        
        console.log('📊 debts after load:', debts);
        
        if (saveToLocalEnabled) {
            saveDebtsToStorage();
            console.log('💾 บันทึก debts ลง localStorage');
        } else {
            console.log('⏭️ ข้ามการบันทึก localStorage (saveToLocalEnabled = false)');
        }
        
        // ✅ เพิ่มบรรทัดนี้: รีเฟรชหน้า debt ถ้าอยู่ในหน้านั้น
        if (getCurrentPage() === 'debt') {
            renderDebtPage();
        }
        
    } catch (error) {
        console.error('Error loading debts:', error);
        throw error;
    }
}


async function saveDebtToBackend(debtData) {
    if (!isLoggedIn || !navigator.onLine) return false;
    
    try {
        const response = await fetch(`${API_URL}/debts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUser.id,
                name: debtData.name,
                categoryId: debtData.categoryId,
                tag: debtData.tag,
                totalAmount: debtData.totalAmount,
                monthlyPayment: debtData.monthlyPayment,
                interestRate: debtData.interestRate || 0,
                dueDate: debtData.dueDate,
                startDate: debtData.startDate,
                status: debtData.status || 'open'
            })
        });
        
        const result = await response.json();
        
        if (response.ok && result.id && debtData.id.startsWith('debt_')) {
            const index = debts.findIndex(d => d.id === debtData.id);
            if (index !== -1) {
                debts[index].id = result.id.toString();
                debts[index].backendId = result.id;
                
                // ✅ แก้ไข: บันทึก local เฉพาะเมื่อ saveToLocalEnabled = true
                if (saveToLocalEnabled) {
                    saveDebtsToStorage();
                }
            }
        }
        
        return response.ok;
    } catch (error) {
        console.error('Error saving debt:', error);
        return false;
    }
}

async function updateDebtInBackend(debtData) {
    if (!isLoggedIn || !navigator.onLine) {
        console.log('⚠️ Cannot update debt: not logged in or offline');
        return false;
    }
    
    // ถ้าเป็น temporary ID ให้บันทึกใหม่เลย
    if (debtData.id.toString().startsWith('debt_')) {
        console.log('⚠️ Temporary ID detected, calling saveDebtToBackend instead');
        return saveDebtToBackend(debtData);
    }
    
    try {
        // ✅ แปลง closedAt ให้เป็นแค่วันที่ (YYYY-MM-DD)
        let closedAt = null;
        if (debtData.closedAt) {
            // ถ้ามีเวลา ให้ตัดทิ้ง
            closedAt = debtData.closedAt.split('T')[0];
            console.log('📅 Converted closedAt from', debtData.closedAt, 'to', closedAt);
        }
        
        // ✅ แปลง startDate ให้เป็นแค่วันที่ (ถ้ามี)
        let startDate = debtData.startDate;
        if (startDate && startDate.includes('T')) {
            startDate = startDate.split('T')[0];
        }
        
        const requestBody = {
            user_id: currentUser.id,
            name: debtData.name,
            categoryId: debtData.categoryId,
            tag: debtData.tag || '',
            totalAmount: debtData.totalAmount,
            monthlyPayment: debtData.monthlyPayment,
            interestRate: debtData.interestRate || 0,
            dueDate: debtData.dueDate,
            startDate: startDate,
            status: debtData.status,
            closedAt: closedAt  // ✅ ส่งเฉพาะวันที่ ไม่มีเวลา
        };
        
        console.log('📤 Updating debt in backend:', {
            id: debtData.id,
            status: debtData.status,
            closedAt: closedAt,
            fullBody: requestBody
        });
        
        const response = await fetch(`${API_URL}/debts/${debtData.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Debt updated in backend successfully:', result);
            return true;
        } else {
            const errorText = await response.text();
            console.error('❌ Failed to update debt:', response.status, errorText);
            return false;
        }
    } catch (error) {
        console.error('❌ Error updating debt:', error);
        return false;
    }
}

async function deleteDebtFromBackend(debtId) {
    if (!isLoggedIn || !navigator.onLine) {
        console.log('⚠️ Cannot delete debt: not logged in or offline');
        return false;
    }
    
    if (debtId.toString().startsWith('debt_')) {
        console.log('⚠️ Temporary ID, skipping backend deletion');
        return true;
    }
    
    try {
        const url = `${API_URL}/debts/${debtId}?user_id=${currentUser.id}`;
        console.log('📡 DELETE debt request to:', url);
        
        const response = await fetch(url, {
            method: 'DELETE'
        });
        
        console.log('📡 Response status:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Debt deleted from backend:', result);
            return true;
        } else {
            const errorText = await response.text();
            console.error('❌ Failed to delete debt:', response.status, errorText);
            
            // ถ้า error เพราะ foreign key ให้แนะนำ
            if (errorText.includes('foreign key constraint')) {
                console.warn('⚠️ Cannot delete debt because it has related payments. Delete payments first.');
            }
            return false;
        }
    } catch (error) {
        console.error('❌ Error deleting debt:', error);
        return false;
    }
}



async function logout() {
    showConfirm('ออกจากระบบ?', 'ข้อมูลในเครื่องจะยังคงอยู่', async () => {
        const queue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
        if (queue.length > 0 && navigator.onLine) {
            showToast('🔄 กำลังซิงค์ข้อมูลก่อนออกจากระบบ...', 'info');
            await processSyncQueue();
        }
        
        const userId = currentUser?.id;
        
        localStorage.removeItem('user');
        isLoggedIn = false;
        currentUser = { id: 'guest_' + Date.now() };
        
        if (userId) {
            const allTx = await financeDB.getAllTransactions();
            const userTx = allTx.filter(t => t.owner_type === 'user' && t.owner_id === userId);
            
            for (const tx of userTx) {
                await financeDB.deleteTransaction(tx.id);
            }
            console.log(`🗑️ ลบข้อมูล user ${userId} จำนวน ${userTx.length} รายการ`);
        }
        
        // ✅ ล้าง debts และ payments (ข้อมูลหนี้)
        debts = [];
        payments = [];
        
        // ✅ ล้าง localStorage ของ debts และ payments
        localStorage.removeItem('fin_debts');
        localStorage.removeItem('fin_debt_payments');
        
        await loadInitialData();
        
        updateLocalSaveCheckbox();
        
        updateAuthButtons();
        hideConfirm();
        
        showToast('👋 ออกจากระบบสำเร็จ', 'success');
        
        updateUI();
    });
    localStorage.removeItem('fin_cache_recent');
}

function closeAllModals() {
    console.log('Closing all modals...');
    
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
        settingsModal.style.display = 'none';
        settingsModal.classList.remove('active', 'open', 'show');
    }
    
    const mobileMenu = document.getElementById('mobileSideMenu');
    if (mobileMenu) {
        mobileMenu.style.display = 'none';
        const panel = document.getElementById('sideMenuPanel');
        if (panel) panel.style.transform = 'translateX(-100%)';
        const backdrop = document.getElementById('sideMenuBackdrop');
        if (backdrop) backdrop.style.display = 'none';
    }
    
    document.querySelectorAll('.modal-backdrop, .menu-backdrop, .fixed.inset-0.bg-black\\/50').forEach(el => {
        el.style.display = 'none';
    });
    
    console.log('All modals closed');
}



async function addTransaction(transactionData) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('กรุณาเข้าสู่ระบบก่อน');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...transactionData,
                user_id: user.id
            })
        });

        if (response.ok) {
            loadUserData();
        } else {
            alert('ไม่สามารถบันทึกข้อมูลได้');
        }
    } catch (error) {
        console.error('Error adding transaction:', error);
    }
}








async function addTransaction(transaction) {
    const user = JSON.parse(localStorage.getItem('user'));
    
    const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...transaction,
            user_id: user.id
        })
    });
    
    return response.json();
}

function showLoginModal() {
    console.log('🔐 Opening login modal');
    
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex'); 
        
        showLoginInModal();
        
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            document.getElementById('login-username')?.focus();
        }, 300);
    } else {
        console.error('❌ loginModal not found!');
    }
}

function hideLoginModal() {
    console.log('🔐 Closing login modal');
    
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        
        document.body.style.overflow = 'auto';
        
        document.getElementById('login-username').value = '';
        document.getElementById('login-password').value = '';
        document.getElementById('reg-username').value = '';
        document.getElementById('reg-password').value = '';
        document.getElementById('reg-confirm-password').value = '';
    }
else {
        console.warn('loginModal not found');
    }
}

function showLoginInModal() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
}

function showRegisterInModal() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

function closeLoginModalOnBackdrop(event) {
    if (event.target === event.currentTarget) {
        hideLoginModal();
    }
}

async function register() {
    try {
        const username = document.getElementById('reg-username')?.value;
        const password = document.getElementById('reg-password')?.value;
        const confirmPass = document.getElementById('reg-confirm-password')?.value;
        
        if (!username || !password || !confirmPass) {
            showToast('⚠️ กรุณากรอกข้อมูลให้ครบ', 'error');
            return;
        }
        
        if (password !== confirmPass) {
            showToast('⚠️ รหัสผ่านไม่ตรงกัน', 'error');
            return;
        }
        
        if (password.length < 6) {
            showToast('⚠️ รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร', 'error');
            return;
        }
        
        showToast('🔄 กำลังสมัครสมาชิก...', 'info');
        
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username: username.trim(), 
                password: password.trim() 
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('✅ สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ', 'success');
            
            // เคลียร์ฟอร์ม
            document.getElementById('reg-username').value = '';
            document.getElementById('reg-password').value = '';
            document.getElementById('reg-confirm-password').value = '';
            
            // เปลี่ยนไปหน้า login
            showLoginInModal();
            
        } else {
            showToast('❌ ' + (data.error || 'ไม่สามารถสมัครสมาชิกได้'), 'error');
        }
        
    } catch (error) {
        console.error('Register error:', error);
        showToast('❌ เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
    }
}

window.debugTransactions = function() {
    console.log('=== DEBUG INFO ===');
    console.log('isLoggedIn:', isLoggedIn);
    console.log('isShowingBackendData:', isShowingBackendData);
    console.log('backendTransactions:', backendTransactions.length, 'รายการ');
    console.log('transactions (local):', transactions.length, 'รายการ');
    console.log('currentMonthKey:', getMonthKey());
    
    if (backendTransactions.length > 0) {
        console.log('เดือนที่มีข้อมูลใน backend:', [...new Set(backendTransactions.map(t => t.monthKey))]);
        console.log('ตัวอย่างรายการแรก:', backendTransactions[0]);
    }
    
    if (transactions.length > 0) {
        console.log('เดือนที่มีข้อมูลใน local:', [...new Set(transactions.map(t => t.monthKey))]);
    }
    
    return '✅ Debug info printed to console';
};

window.debugIndexedDB = async function() {
    console.log('=== IndexedDB Debug ===');
    console.log('financeDB.db exists:', !!financeDB.db);
    console.log('financeDB.initialized:', financeDB.initialized);
    console.log('financeDB.saveToIndexedDBEnabled:', financeDB.saveToIndexedDBEnabled);
    
    if (financeDB.db) {
        console.log('Connection state:', financeDB.db.readyState);
        try {
            const tx = financeDB.db.transaction(['transactions'], 'readonly');
            console.log('✅ สามารถสร้าง transaction ได้');
            
            const store = tx.objectStore('transactions');
            const count = await new Promise((resolve) => {
                const req = store.count();
                req.onsuccess = () => resolve(req.result);
            });
            console.log(`📊 มี ${count} รายการใน IndexedDB`);
            
        } catch (e) {
            console.error('❌ ไม่สามารถ query ได้:', e);
        }
    }
    
    return 'ตรวจสอบเสร็จ';
};
class IndexedDB {
    constructor(dbName, storeName) {
        this.dbName = dbName;
        this.storeName = storeName;
        this.db = null;
    }

    async _init() {
        return new Promise((resolve, reject) => {
            if (this.db) return resolve(this.db);
            const request = indexedDB.open(this.dbName, 1);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onerror = (event) => reject(event.target.error);
        });
    }

    async set(key, value) {
        const db = await this._init();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(this.storeName, "readwrite");
            const store = tx.objectStore(this.storeName);
            const request = store.put(value, key);
            
            request.onsuccess = () => resolve(true);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async get(key) {
        const db = await this._init();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(this.storeName, "readonly");
            const store = tx.objectStore(this.storeName);
            const request = store.get(key);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async contains(key) {
        return this.count(key)
            .then(count => count > 0)
            .catch(error => {
                console.error(error);
                return false; 
            });
    }

    async delete(key) {
        const db = await this._init();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(this.storeName, "readwrite");
            const store = tx.objectStore(this.storeName);
            const request = store.delete(key);
            
            request.onsuccess = () => resolve(true);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async clear() {
        const db = await this._init();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(this.storeName, "readwrite");
            const store = tx.objectStore(this.storeName);
            const request = store.clear();
            
            request.onsuccess = () => resolve(true);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async keys() {
        const db = await this._init();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(this.storeName, "readonly");
            const store = tx.objectStore(this.storeName);
            const request = store.getAllKeys();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async count() {
        const db = await this._init();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(this.storeName, "readonly");
            const store = tx.objectStore(this.storeName);
            const request = store.count();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }
}

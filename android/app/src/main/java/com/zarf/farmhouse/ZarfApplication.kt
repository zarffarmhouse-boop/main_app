package com.zarf.farmhouse

import android.app.Application
import com.zarf.farmhouse.data.local.AppDatabase

class ZarfApplication : Application() {
    val database: AppDatabase by lazy { AppDatabase.getDatabase(this) }

    override fun onCreate() {
        super.onCreate()
    }
}

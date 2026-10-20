package com.zarf.farmhouse

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.zarf.farmhouse.ui.screens.*
import com.zarf.farmhouse.ui.theme.ZarfFarmhouseTheme
import com.zarf.farmhouse.ui.viewmodel.FarmhouseViewModel

class MainActivity : ComponentActivity() {
    private val viewModel: FarmhouseViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            var isDarkMode by remember { mutableStateOf(false) }
            var isLoggedIn by remember { mutableStateOf(false) }

            ZarfFarmhouseTheme(darkTheme = isDarkMode) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    if (!isLoggedIn) {
                        LoginScreen(
                            onLoginSuccess = { isLoggedIn = true }
                        )
                    } else {
                        MainScreenContainer(
                            viewModel = viewModel,
                            isDarkMode = isDarkMode,
                            onToggleDarkMode = { isDarkMode = !isDarkMode }
                        )
                    }
                }
            }
        }
    }
}

enum class NavigationTab(val label: String) {
    Home("Home"),
    Enquiries("Enquiries"),
    Bookings("Bookings"),
    Expenses("Expenses"),
    More("More")
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreenContainer(
    viewModel: FarmhouseViewModel,
    isDarkMode: Boolean,
    onToggleDarkMode: () -> Unit
) {
    var selectedTab by remember { mutableStateOf(NavigationTab.Home) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Zarf Farmhouse",
                            style = MaterialTheme.typography.titleLarge
                        )
                        Text(
                            text = "Bhopal Manager",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                actions = {
                    IconButton(
                        onClick = onToggleDarkMode,
                        modifier = Modifier.size(56.dp)
                    ) {
                        Icon(
                            imageVector = if (isDarkMode) Icons.Default.LightMode else Icons.Default.DarkMode,
                            contentDescription = "Toggle Dark Mode",
                            modifier = Modifier.size(32.dp)
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                ),
                windowInsets = WindowInsets(0.dp, 0.dp, 0.dp, 0.dp)
            )
        },
        bottomBar = {
            NavigationBar(
                modifier = Modifier.height(84.dp),
                containerColor = MaterialTheme.colorScheme.surface,
                windowInsets = WindowInsets(0.dp, 0.dp, 0.dp, 0.dp)
            ) {
                NavigationTab.values().forEach { tab ->
                    NavigationBarItem(
                        selected = selectedTab == tab,
                        onClick = { selectedTab = tab },
                        icon = {
                            val icon = when (tab) {
                                NavigationTab.Home -> Icons.Default.Home
                                NavigationTab.Enquiries -> Icons.Default.QuestionAnswer
                                NavigationTab.Bookings -> Icons.Default.EventAvailable
                                NavigationTab.Expenses -> Icons.Default.CurrencyRupee
                                NavigationTab.More -> Icons.Default.MoreHoriz
                            }
                            Icon(
                                imageVector = icon,
                                contentDescription = tab.label,
                                modifier = Modifier.size(30.dp)
                            )
                        },
                        label = {
                            Text(
                                text = tab.label,
                                fontSize = 16.sp
                            )
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 8.dp, vertical = 4.dp)
        ) {
            when (selectedTab) {
                NavigationTab.Home -> HomeScreen(viewModel, onNavigate = { selectedTab = it })
                NavigationTab.Enquiries -> EnquiriesScreen(viewModel)
                NavigationTab.Bookings -> BookingsScreen(viewModel)
                NavigationTab.Expenses -> ExpensesScreen(viewModel)
                NavigationTab.More -> MoreScreen(viewModel)
            }
        }
    }
}

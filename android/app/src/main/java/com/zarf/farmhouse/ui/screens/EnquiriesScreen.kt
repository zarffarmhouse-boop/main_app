package com.zarf.farmhouse.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.zarf.farmhouse.data.local.EnquiryEntity
import com.zarf.farmhouse.ui.viewmodel.FarmhouseViewModel

@Composable
fun EnquiriesScreen(viewModel: FarmhouseViewModel) {
    val enquiries by viewModel.allEnquiries.collectAsState()
    var showAddDialog by remember { mutableStateOf(false) }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showAddDialog = true },
                modifier = Modifier.size(64.dp)
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Enquiry", modifier = Modifier.size(32.dp))
            }
        }
    ) { padding ->
        Box(modifier = Modifier.padding(padding)) {
            if (enquiries.isEmpty()) {
                Column(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.Center,
                    horizontalAlignment = androidx.compose.ui.Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "No enquiries yet",
                        style = MaterialTheme.typography.titleMedium
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Button(
                        onClick = { showAddDialog = true },
                        modifier = Modifier.height(56.dp)
                    ) {
                        Text("Add first enquiry", style = MaterialTheme.typography.labelLarge)
                    }
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(enquiries) { enquiry ->
                        EnquiryCard(enquiry, viewModel)
                    }
                }
            }
        }
    }

    if (showAddDialog) {
        AddEnquiryDialog(
            onDismiss = { showAddDialog = false },
            onAdd = { viewModel.addEnquiry(it); showAddDialog = false }
        )
    }
}

@Composable
fun EnquiryCard(enquiry: EnquiryEntity, viewModel: FarmhouseViewModel) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = enquiry.name,
                style = MaterialTheme.typography.titleMedium
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = enquiry.occasion,
                style = MaterialTheme.typography.bodyMedium
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Guests: ${enquiry.guestsRange}",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Status: ${enquiry.status}",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.primary
            )
        }
    }
}

@Composable
fun AddEnquiryDialog(onDismiss: () -> Unit, onAdd: (EnquiryEntity) -> Unit) {
    var name by remember { mutableStateOf("") }
    var occasion by remember { mutableStateOf("") }
    var guests by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("New Enquiry") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Name") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = occasion,
                    onValueChange = { occasion = it },
                    label = { Text("Occasion") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = guests,
                    onValueChange = { guests = it },
                    label = { Text("Guest Range (e.g., 0-30)") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (name.isNotEmpty()) {
                        onAdd(
                            EnquiryEntity(
                                name = name,
                                occasion = occasion,
                                guestsRange = guests,
                                enquiryDate = java.time.LocalDate.now().toString()
                            )
                        )
                    }
                },
                modifier = Modifier.height(48.dp)
            ) {
                Text("Add")
            }
        },
        dismissButton = {
            Button(onClick = onDismiss, modifier = Modifier.height(48.dp)) {
                Text("Cancel")
            }
        }
    )
}

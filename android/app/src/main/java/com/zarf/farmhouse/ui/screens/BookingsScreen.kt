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
import com.zarf.farmhouse.data.local.BookingEntity
import com.zarf.farmhouse.ui.viewmodel.FarmhouseViewModel

@Composable
fun BookingsScreen(viewModel: FarmhouseViewModel) {
    val bookings by viewModel.allBookings.collectAsState()
    var showAddDialog by remember { mutableStateOf(false) }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showAddDialog = true },
                modifier = Modifier.size(64.dp)
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Booking", modifier = Modifier.size(32.dp))
            }
        }
    ) { padding ->
        Box(modifier = Modifier.padding(padding)) {
            if (bookings.isEmpty()) {
                Column(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.Center,
                    horizontalAlignment = androidx.compose.ui.Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "No bookings yet",
                        style = MaterialTheme.typography.titleMedium
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Button(
                        onClick = { showAddDialog = true },
                        modifier = Modifier.height(56.dp)
                    ) {
                        Text("Add first booking", style = MaterialTheme.typography.labelLarge)
                    }
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(bookings) { booking ->
                        BookingCard(booking, viewModel)
                    }
                }
            }
        }
    }

    if (showAddDialog) {
        AddBookingDialog(
            onDismiss = { showAddDialog = false },
            onAdd = { viewModel.addBooking(it); showAddDialog = false }
        )
    }
}

@Composable
fun BookingCard(booking: BookingEntity, viewModel: FarmhouseViewModel) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = booking.guestName,
                style = MaterialTheme.typography.titleMedium
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = booking.occasion,
                style = MaterialTheme.typography.bodyMedium
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Check-in: ${booking.checkInDate}",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Guests: ${booking.guestsRange}",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Payment: ${booking.paymentStatus}",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.primary
            )
        }
    }
}

@Composable
fun AddBookingDialog(onDismiss: () -> Unit, onAdd: (BookingEntity) -> Unit) {
    var name by remember { mutableStateOf("") }
    var occasion by remember { mutableStateOf("") }
    var checkIn by remember { mutableStateOf("") }
    var guests by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("New Booking") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Guest Name") },
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
                    value = checkIn,
                    onValueChange = { checkIn = it },
                    label = { Text("Check-in Date (YYYY-MM-DD)") },
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
                            BookingEntity(
                                guestName = name,
                                occasion = occasion,
                                checkInDate = checkIn,
                                checkOutDate = checkIn,
                                guestsRange = guests
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

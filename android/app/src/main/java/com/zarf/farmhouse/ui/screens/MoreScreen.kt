package com.zarf.farmhouse.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.zarf.farmhouse.data.local.PersonEntity
import com.zarf.farmhouse.data.local.TodoEntity
import com.zarf.farmhouse.ui.viewmodel.FarmhouseViewModel

@Composable
fun MoreScreen(viewModel: FarmhouseViewModel) {
    val people by viewModel.allPeople.collectAsState()
    val todos by viewModel.allTodos.collectAsState()
    var selectedSection by remember { mutableStateOf<MoreSection>(MoreSection.People) }

    Column(
        modifier = Modifier.fillMaxSize()
    ) {
        TabRow(selectedTabIndex = selectedSection.ordinal) {
            MoreSection.values().forEach { section ->
                Tab(
                    selected = selectedSection == section,
                    onClick = { selectedSection = section },
                    text = { Text(section.label) }
                )
            }
        }

        when (selectedSection) {
            MoreSection.People -> PeopleSection(viewModel, people)
            MoreSection.Todos -> TodosSection(viewModel, todos)
            MoreSection.Marketing -> MarketingSection()
            MoreSection.Contacts -> ContactsSection()
        }
    }
}

enum class MoreSection(val label: String) {
    People("People"),
    Todos("Todos"),
    Marketing("Marketing"),
    Contacts("Contacts")
}

@Composable
fun PeopleSection(viewModel: FarmhouseViewModel, people: List<PersonEntity>) {
    var showAddDialog by remember { mutableStateOf(false) }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showAddDialog = true },
                modifier = Modifier.size(64.dp)
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Person", modifier = Modifier.size(32.dp))
            }
        }
    ) { padding ->
        Box(modifier = Modifier.padding(padding)) {
            if (people.isEmpty()) {
                Column(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.Center,
                    horizontalAlignment = androidx.compose.ui.Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "No contacts yet",
                        style = MaterialTheme.typography.titleMedium
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Button(
                        onClick = { showAddDialog = true },
                        modifier = Modifier.height(56.dp)
                    ) {
                        Text("Add first contact", style = MaterialTheme.typography.labelLarge)
                    }
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(people) { person ->
                        PersonCard(person, viewModel)
                    }
                }
            }
        }
    }

    if (showAddDialog) {
        AddPersonDialog(
            onDismiss = { showAddDialog = false },
            onAdd = { viewModel.addPerson(it); showAddDialog = false }
        )
    }
}

@Composable
fun PersonCard(person: PersonEntity, viewModel: FarmhouseViewModel) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = person.name,
                style = MaterialTheme.typography.titleMedium
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = person.role,
                style = MaterialTheme.typography.bodyMedium
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = person.phone,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
fun AddPersonDialog(onDismiss: () -> Unit, onAdd: (PersonEntity) -> Unit) {
    var name by remember { mutableStateOf("") }
    var role by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("New Contact") },
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
                    value = role,
                    onValueChange = { role = it },
                    label = { Text("Role") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = phone,
                    onValueChange = { phone = it },
                    label = { Text("Phone") },
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
                            PersonEntity(
                                name = name,
                                role = role,
                                phone = phone
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

@Composable
fun TodosSection(viewModel: FarmhouseViewModel, todos: List<TodoEntity>) {
    var showAddDialog by remember { mutableStateOf(false) }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showAddDialog = true },
                modifier = Modifier.size(64.dp)
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Todo", modifier = Modifier.size(32.dp))
            }
        }
    ) { padding ->
        Box(modifier = Modifier.padding(padding)) {
            if (todos.isEmpty()) {
                Column(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.Center,
                    horizontalAlignment = androidx.compose.ui.Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "No tasks yet",
                        style = MaterialTheme.typography.titleMedium
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Button(
                        onClick = { showAddDialog = true },
                        modifier = Modifier.height(56.dp)
                    ) {
                        Text("Add first task", style = MaterialTheme.typography.labelLarge)
                    }
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(todos) { todo ->
                        TodoCard(todo, viewModel)
                    }
                }
            }
        }
    }

    if (showAddDialog) {
        AddTodoDialog(
            onDismiss = { showAddDialog = false },
            onAdd = { viewModel.addTodo(it); showAddDialog = false }
        )
    }
}

@Composable
fun TodoCard(todo: TodoEntity, viewModel: FarmhouseViewModel) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = todo.title,
                    style = MaterialTheme.typography.titleMedium,
                    color = if (todo.isDone) MaterialTheme.colorScheme.onSurfaceVariant else MaterialTheme.colorScheme.onSurface
                )
            }
            Checkbox(
                checked = todo.isDone,
                onCheckedChange = { viewModel.toggleTodo(todo) },
                modifier = Modifier.size(32.dp)
            )
        }
    }
}

@Composable
fun AddTodoDialog(onDismiss: () -> Unit, onAdd: (TodoEntity) -> Unit) {
    var title by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("New Task") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text("Task") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (title.isNotEmpty()) {
                        onAdd(
                            TodoEntity(
                                title = title
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

@Composable
fun MarketingSection() {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = androidx.compose.ui.Alignment.Center
    ) {
        Text(
            text = "Marketing features coming soon",
            style = MaterialTheme.typography.titleMedium
        )
    }
}

@Composable
fun ContactsSection() {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = androidx.compose.ui.Alignment.Center
    ) {
        Text(
            text = "Contacts features coming soon",
            style = MaterialTheme.typography.titleMedium
        )
    }
}

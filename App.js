import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';

// Caminhos atualizados para aceder à pasta src a partir da raiz
import { useBoardController } from './src/hooks/useBoardController';
import { TaskCard } from './src/components/TaskCard';

export default function App() {
  const {
    columns,
    addTask,
    updateTitle,
    updateDescription,
    moveTask,
    toggleComplete,
    deleteTask,
  } = useBoardController();

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Board</Text>

      <ScrollView 
        style={styles.scrollArea} 
        contentContainerStyle={styles.boardContainer}
        horizontal 
        showsHorizontalScrollIndicator={false}
      >
        {columns.map((column) => (
          <View key={column.id} style={styles.column}>
            <View style={styles.columnHeader}>
              <Text style={styles.columnTitle}>{column.title}</Text>
              <TouchableOpacity onPress={() => addTask(column.id)} style={styles.addButton}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ flexGrow: 1, zIndex: 1 }}>
              {column.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  columnId={column.id}
                  columns={columns}
                  onUpdateTitle={updateTitle}
                  onUpdateDescription={updateDescription}
                  onQuickComplete={toggleComplete}
                  onMoveTask={moveTask}
                  onDeleteTask={deleteTask}
                />
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F7FA', 
    paddingTop: 50,
    // Força o contentor a ocupar toda a altura do navegador
    height: Platform.OS === 'web' ? '100vh' : '100%', 
  },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 20, 
    color: '#333' 
  },
  scrollArea: {
    flex: 1,
    width: '100%',
  },
  boardContainer: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  column: { 
    width: 280, 
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    padding: 15, 
    marginHorizontal: 10, 
    marginBottom: 40, 
    // Altura mínima definida para garantir que não colapsa se estiver vazia
    minHeight: 300,
    zIndex: 1 
  },
  columnHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  columnTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#444' 
  },
  addButton: { 
    backgroundColor: '#000', 
    width: 28, 
    height: 28, 
    borderRadius: 14, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  addButtonText: { 
    color: '#FFF', 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginTop: -2 
  },
});
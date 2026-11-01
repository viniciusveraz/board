import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, PanResponder, Animated } from 'react-native';
import { COMPLETED_COLUMN_ID } from '../domain/boardDomain';

const DRAG_THRESHOLD = 120;

export const TaskCard = ({
  task,
  columnId,
  columns,
  onUpdateTitle,
  onUpdateDescription,
  onQuickComplete,
  onMoveTask,
  onDeleteTask,
}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const isCompleted = columnId === COMPLETED_COLUMN_ID;

  // 1. Estados locais para garantir a digitação fluida no React Native Web
  const [localTitle, setLocalTitle] = useState(task.title || '');
  const [localDescription, setLocalDescription] = useState(task.description || '');
  const [isEditing, setIsEditing] = useState(false);

  // Sincroniza o estado local caso a prop externa mude (ex: ao mover de coluna)
  useEffect(() => {
    setLocalTitle(task.title || '');
  }, [task.title]);

  useEffect(() => {
    setLocalDescription(task.description || '');
  }, [task.description]);

  // Ref de estado atualizado para o PanResponder
  const stateRef = useRef({ task, columns, columnId, isEditing });
  useEffect(() => {
    stateRef.current = { task, columns, columnId, isEditing };
  }, [task, columns, columnId, isEditing]);

  // 2. PanResponder desativado quando o utilizador está a editar
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (stateRef.current.isEditing) return false;
        return Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: (e, gestureState) => {
        if (stateRef.current.isEditing) return;
        Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false })(e, gestureState);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (stateRef.current.isEditing) return;

        const { task: currentTask, columns: currentCols, columnId: currentColId } = stateRef.current;
        const currentColIndex = currentCols.findIndex((c) => c.id === currentColId);

        if (gestureState.dx > DRAG_THRESHOLD && currentColIndex < currentCols.length - 1) {
          onMoveTask(currentColId, currentCols[currentColIndex + 1].id, currentTask);
        } else if (gestureState.dx < -DRAG_THRESHOLD && currentColIndex > 0) {
          onMoveTask(currentColId, currentCols[currentColIndex - 1].id, currentTask);
        }

        Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 5, useNativeDriver: false }).start();
      },
    })
  ).current;

  // Funções para lidar com a mudança de texto local e envio ao pai
  const handleTitleChange = (text) => {
    setLocalTitle(text);
    onUpdateTitle(columnId, task.id, text);
  };

  const handleDescriptionChange = (text) => {
    setLocalDescription(text);
    onUpdateDescription(columnId, task.id, text);
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.card,
        { transform: [{ translateX: pan.x }, { translateY: pan.y }] },
        { zIndex: pan.x._value !== 0 ? 999 : 1 },
      ]}
    >
      <View style={styles.cardHeader}>
        <TextInput
          style={[styles.titleInput, isCompleted && styles.textCompleted]}
          value={localTitle}
          onChangeText={handleTitleChange}
          onFocus={() => setIsEditing(true)}
          onBlur={() => setIsEditing(false)}
          placeholder="Título da tarefa..."
          placeholderTextColor="#999"
          multiline={false}
          maxLength={100}
        />
      </View>

      <TextInput
        style={[styles.descriptionInput, isCompleted && styles.textCompleted]}
        value={localDescription}
        onChangeText={handleDescriptionChange}
        onFocus={() => setIsEditing(true)}
        onBlur={() => setIsEditing(false)}
        multiline={true}
        scrollEnabled={false}
        placeholder="Adicione uma descrição..."
        placeholderTextColor="#BBB"
        maxLength={500}
      />

      <View style={styles.cardFooter}>
        <TouchableOpacity onPress={() => onDeleteTask(columnId, task.id)} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onQuickComplete(columnId, task)}
          style={[styles.checkButton, isCompleted ? styles.checkButtonActive : styles.checkButtonInactive]}
        >
          <Text style={styles.checkButtonText}>✓</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#CCC', borderRadius: 12, padding: 12, marginBottom: 15, flexDirection: 'column' },
  cardHeader: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 8 },
  titleInput: { fontSize: 16, fontWeight: 'bold', color: '#333', flex: 1, paddingRight: 10, paddingTop: 0, paddingBottom: 0 },
  descriptionInput: { fontSize: 14, color: '#555', minHeight: 40, textAlignVertical: 'top', marginBottom: 10, paddingTop: 0, paddingBottom: 0 },
  textCompleted: { textDecorationLine: 'line-through', color: '#999' },
  cardFooter: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 5 },
  checkButton: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  checkButtonInactive: { backgroundColor: '#E0E0E0' },
  checkButtonActive: { backgroundColor: '#4CAF50' },
  checkButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  deleteButton: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFEBEE', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  deleteButtonText: { color: '#F44336', fontSize: 12, fontWeight: 'bold' },
});
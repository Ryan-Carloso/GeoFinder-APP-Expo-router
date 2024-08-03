// LinkButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function LinkFunction({ href, title, options }) {
  return (
    <Link href={{ pathname: href, params: { ...options } }} asChild>
      <TouchableOpacity style={styles.optionButton}>
        <Text style={styles.optionButtonText}>{title}</Text>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  optionButton: {
    backgroundColor: '#388b02',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  optionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

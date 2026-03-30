import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { CreateSportRequest } from '../../models/Sport';
import { sportService } from '../../services/sportService';
import { styles } from './SportModalStyle';
import { APP_STRINGS } from '../../constants/appStrings';
import { validationMessages } from '../../constants/validationMessages';
import { FormatType } from '../../models/Event';

type SportModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

const formatOptions: FormatType[] = [FormatType.Singles, FormatType.Doubles, FormatType.Both];

export const SportModal = ({
  visible,
  onClose,
  onCreated,
}: SportModalProps) => {
  const [name, setName] = useState('');
  const [formats, setFormats] = useState<FormatType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState('');
  const [formatError, setFormatError] = useState('');

  const resetForm = () => {
    setName('');
    setFormats([]);
    setError(null);
    setNameError('');
    setFormatError('');
  };

  const handleClose = () => {
    if (loading) {
      return;
    }

    resetForm();
    onClose();
  };

  const handleToggleFormat = (format: FormatType) => {
    setFormatError('');

    setFormats((prev) =>
      prev.includes(format)
        ? prev.filter((item) => item !== format)
        : [...prev, format],
    );
  };

  const validate = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError(validationMessages.SPORT_REQUIRED);
      isValid = false;
    }

    if (formats.length === 0) {
      setFormatError(validationMessages.REQUIRED_FORMAT);
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    setError(null);
    setNameError('');
    setFormatError('');

    if (!validate()) {
      return;
    }

    const payload: CreateSportRequest = {
      name: name.trim(),
      allowedFormats: formats,
    };

    try {
      setLoading(true);
      await sportService.create(payload);
      resetForm();
      onClose();
      onCreated?.();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : validationMessages.FAILED_CREATE_SPORTS,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{APP_STRINGS.app.addSports}</Text>

          <Text style={styles.label}>{APP_STRINGS.app.sportsName}</Text>
          <TextInput
            value={name}
            onChangeText={(text) => {
              setName(text);
              setNameError('');
              setError(null);
            }}
            placeholder={APP_STRINGS.placeHolders.sportsName}
            style={styles.input}
            editable={!loading}
          />
          {!!nameError && <Text style={styles.errorText}>{nameError}</Text>}

          <Text style={styles.label}>{APP_STRINGS.app.formats}</Text>
          <View style={styles.tabContainer}>
            {formatOptions.map((option) => {
              const isSelected = formats.includes(option);

              return (
                <TouchableOpacity
                  key={option}
                  onPress={() => handleToggleFormat(option)}
                  style={[styles.tab, isSelected && styles.selectedTab]}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.tabText,
                      isSelected && styles.selectedTabText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {!!formatError && <Text style={styles.errorText}>{formatError}</Text>}
          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.footer}>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.cancelButton}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>
                {APP_STRINGS.app.cancel}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.createButton}
              disabled={loading}
            >
              <Text style={styles.createButtonText}>
                {APP_STRINGS.app.create}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

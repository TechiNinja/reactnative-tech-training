import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { authFetch } from '../utils/authFetch';
import { API_ENDPOINTS } from '../config/api';
import { APP_STRINGS } from '../constants/AppStrings';
import { assignOrganizer } from '../services/eventService';

type OrganizerOption = {
  id: number;
  fullName: string;
  email: string;
};

type UserResponse = {
  id: number;
  fullName: string;
  email: string;
  roleName: string;
  isActive: boolean;
};

export const useAssignOrganizerScreenViewModel = (
  eventId: number,
  currentOrganizerName: string | undefined,
  onSuccess: () => void,
) => {
  const [organizers, setOrganizers] = useState<OrganizerOption[]>([]);
  const [selectedOrganizerId, setSelectedOrganizerId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchOrganizers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await authFetch<UserResponse[]>(API_ENDPOINTS.USERS);
      const filtered = (data ?? [])
        .filter((u) => u.roleName === 'organizer' && u.isActive)
        .map((u) => ({ id: u.id, fullName: u.fullName, email: u.email }));
      setOrganizers(filtered);
    } catch {
      setOrganizers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrganizers();
  }, [fetchOrganizers]);

  const handleAssign = async () => {
    if (!selectedOrganizerId) {
      Alert.alert(APP_STRINGS.eventScreen.assignOrganizer, APP_STRINGS.eventScreen.noOrganizersAvailable);
      return;
    }
    try {
      setSaving(true);
      await assignOrganizer(eventId, selectedOrganizerId);
      Alert.alert(APP_STRINGS.eventScreen.assignOrganizer, APP_STRINGS.eventScreen.assignOrganizerSuccess);
      onSuccess();
    } catch {
      Alert.alert(APP_STRINGS.eventScreen.assignOrganizer, APP_STRINGS.eventScreen.assignOrganizerError);
    } finally {
      setSaving(false);
    }
  };

  return {
    organizers,
    selectedOrganizerId,
    setSelectedOrganizerId,
    loading,
    saving,
    handleAssign,
  };
};
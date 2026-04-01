import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { APP_STRINGS } from '../constants/appStrings';
import { assignOrganizer } from '../services/eventService';
import { getUserList } from '../services/userService';

type OrganizerOption = {
  id: number;
  fullName: string;
  email: string;
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
      const users = await getUserList();
      const filtered = users
        .filter((u) => u.role === 'organizer' && u.isActive)
        .map((u) => ({ id: Number(u.id), fullName: u.name, email: u.email }));
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
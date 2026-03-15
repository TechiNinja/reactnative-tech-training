import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { RoleType } from '../../constants/Roles';
import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
import { styles } from './EventRequestListScreenStyles';
import EventRequestStatusTabs from '../../components/EventRequestStatusTab/EventRequestStatusTab';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import AppButton from '../../components/AppButton/AppButton';
import { APP_STRINGS } from '../../constants/AppStrings';
import { useEventRequestListViewModel } from '../../viewModels/EventRequestListScreenViewModel';
import EventRequestCard from '../../components/EventRequestCard/EventRequestCard';

type EventRequestListScreenProps = {
  role: RoleType;
};

const EventRequestListScreen = ({ role }: EventRequestListScreenProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const viewModel = useEventRequestListViewModel(navigation, role);

  return (
    <ScreenWrapper scrollable={false}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text
            style={
              role === 'participant'
                ? styles.headingParticipant
                : styles.heading
            }
          >
            {APP_STRINGS.RequestScreen.request}
          </Text>

          {(role === 'admin') && (
            <AppButton
              title={APP_STRINGS.RequestScreen.raiseRequest}
              onPress={viewModel.onRaiseRequest}
            />
          )}
        </View>

        <EventRequestStatusTabs
          activeTab={viewModel.activeTab}
          onChange={viewModel.setActiveTab}
        />

        {viewModel.requests.length === 0 ? (
          <Text style={styles.noEventStyle}>{APP_STRINGS.RequestScreen.noRequestFound}</Text>
        ) : (
          <FlatList
            data={viewModel.requests}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <EventRequestCard
                request={item}
                role={role}
                onPress={() => viewModel.onRequestPress(item)}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={viewModel.getContentContainerStyle()}
            onRefresh={viewModel.onRefresh}
            refreshing={viewModel.refreshing}
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

export default EventRequestListScreen;
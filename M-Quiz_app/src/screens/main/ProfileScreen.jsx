import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Switch,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography } from '../../theme/theme';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '../../components/AppButton';
import * as Animatable from 'react-native-animatable';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  
  // Edit user form states
  const [editName, setEditName] = useState(user?.name || "");
  const [editEmail, setEditEmail] = useState(user?.email || "");

  // Settings states
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      await updateProfile({
        name: editName,
        email: editEmail,
      });
      setEditModalVisible(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: logout },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9575cd" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Animatable.View animation="fadeInDown" style={styles.profileHeader}>
          <Image 
            source={require('../../assets/images/avatar.png')} 
            style={styles.avatar} 
          />
          <Text style={styles.name}>{user?.name || 'Guest User'}</Text>
          <Text style={styles.email}>{user?.email || 'guest@quizon.com'}</Text>
          
          <TouchableOpacity 
            onPress={() => setEditModalVisible(true)}
            style={styles.editButton}
          >
            <Ionicons name="create-outline" size={16} color="#9575cd" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={200} style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Quizzes Played</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>82%</Text>
            <Text style={styles.statLabel}>Win Rate</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>#214</Text>
            <Text style={styles.statLabel}>Global Rank</Text>
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={400} style={styles.menuContainer}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => setSettingsModalVisible(true)}
          >
            <Ionicons name="settings-outline" size={24} color="#9575cd" />
            <Text style={styles.menuText}>Settings</Text>
            <Ionicons name="chevron-forward" size={24} color="#9575cd" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={24} color="#9575cd" />
            <Text style={styles.menuText}>Help Center</Text>
            <Ionicons name="chevron-forward" size={24} color="#9575cd" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="information-circle-outline" size={24} color="#9575cd" />
            <Text style={styles.menuText}>About Quizon</Text>
            <Ionicons name="chevron-forward" size={24} color="#9575cd" />
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={600} style={styles.footer}>
          <AppButton 
            title="Logout" 
            onPress={handleLogout} 
            style={styles.logoutButton}
            color="#f44336"
            icon={<Ionicons name="log-out-outline" size={20} color="white" />}
          />
        </Animatable.View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close-outline" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Enter your name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editEmail}
                  onChangeText={setEditEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                onPress={() => setEditModalVisible(false)} 
                style={styles.modalCancelButton}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={handleUpdateProfile} 
                style={styles.modalSaveButton}
              >
                <Text style={styles.modalSaveText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={settingsModalVisible}
        onRequestClose={() => setSettingsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Settings</Text>
              <TouchableOpacity onPress={() => setSettingsModalVisible(false)}>
                <Ionicons name="close-outline" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="volume-high-outline" size={20} color="#666" />
                  <Text style={styles.settingText}>Sound Effects</Text>
                </View>
                <Switch
                  value={soundEnabled}
                  onValueChange={setSoundEnabled}
                  trackColor={{ false: "#E0E0E0", true: "#9575cd" }}
                  thumbColor={soundEnabled ? "#FFFFFF" : "#FFFFFF"}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="notifications-outline" size={20} color="#666" />
                  <Text style={styles.settingText}>Notifications</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: "#E0E0E0", true: "#9575cd" }}
                  thumbColor={notificationsEnabled ? "#FFFFFF" : "#FFFFFF"}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="vibrate-outline" size={20} color="#666" />
                  <Text style={styles.settingText}>Vibration</Text>
                </View>
                <Switch
                  value={vibrationEnabled}
                  onValueChange={setVibrationEnabled}
                  trackColor={{ false: "#E0E0E0", true: "#9575cd" }}
                  thumbColor={vibrationEnabled ? "#FFFFFF" : "#FFFFFF"}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: spacing.md,
    color: '#757575',
  },
  container: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#9575cd',
    marginBottom: spacing.md,
  },
  name: { 
    ...typography.h1,
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: spacing.xs,
  },
  email: { 
    ...typography.body,
    color: '#757575',
    marginBottom: spacing.md,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#9575cd',
    backgroundColor: 'rgba(149, 117, 205, 0.1)',
  },
  editButtonText: {
    ...typography.body,
    color: '#9575cd',
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  statBox: { 
    alignItems: 'center',
    flex: 1,
  },
  statValue: { 
    ...typography.h2,
    fontSize: 22,
    fontWeight: '700',
    color: '#9575cd',
    marginBottom: spacing.xs,
  },
  statLabel: { 
    ...typography.caption,
    color: '#757575',
    fontSize: 12,
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    ...typography.body,
    flex: 1,
    marginLeft: spacing.md,
    color: '#424242',
  },
  logoutButton: {
    marginTop: spacing.xl,
  },
  footer: {
    marginBottom: spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    ...typography.h2,
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  modalBody: {
    padding: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.body,
    color: '#424242',
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  modalInput: {
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    color: '#333',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  modalCancelButton: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: spacing.sm,
  },
  modalCancelText: {
    ...typography.body,
    color: '#757575',
    fontWeight: '600',
  },
  modalSaveButton: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#9575cd',
    marginLeft: spacing.sm,
  },
  modalSaveText: {
    ...typography.body,
    color: 'white',
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    ...typography.body,
    color: '#424242',
    marginLeft: spacing.md,
  },
});

export default ProfileScreen;
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Save, Bell, Shield, Globe, Database, Palette, RotateCcw } from "lucide-react"

interface Settings {
  platformName: string
  maxPlayers: string
  questionTime: number
  autoStart: boolean
  twoFactor: boolean
  emailVerification: boolean
  rateLimiting: boolean
  sessionTimeout: number
  emailNotifications: boolean
  pushNotifications: boolean
  tournamentReminders: boolean
  weeklyReports: boolean
  defaultTheme: string
  primaryColor: string
  animations: boolean
  backupFrequency: string
  retentionDays: number
}

const initialSettings: Settings = {
  platformName: "Quiz Battle",
  maxPlayers: "10",
  questionTime: 30,
  autoStart: true,
  twoFactor: false,
  emailVerification: true,
  rateLimiting: true,
  sessionTimeout: 60,
  emailNotifications: true,
  pushNotifications: true,
  tournamentReminders: true,
  weeklyReports: false,
  defaultTheme: "system",
  primaryColor: "blue",
  animations: true,
  backupFrequency: "daily",
  retentionDays: 30,
}

export function Settings() {
  const [settings, setSettings] = useState<Settings>(initialSettings)
  const [hasChanges, setHasChanges] = useState(false)

  const handleSettingChange = (key: keyof Settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSaveSettings = () => {
    // In a real app, this would save to the backend
    alert("Settings saved successfully!")
    setHasChanges(false)
  }

  const handleResetToDefaults = () => {
    if (confirm("Are you sure you want to reset all settings to defaults?")) {
      setSettings(initialSettings)
      setHasChanges(true)
      alert("Settings reset to defaults!")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Configure your quiz platform settings</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleResetToDefaults}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSaveSettings} disabled={!hasChanges}>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>General Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform-name">Platform Name</Label>
              <Input 
                id="platform-name" 
                value={settings.platformName}
                onChange={(e) => handleSettingChange('platformName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-players">Max Players per Game</Label>
              <Select value={settings.maxPlayers} onValueChange={(value) => handleSettingChange('maxPlayers', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4 Players</SelectItem>
                  <SelectItem value="6">6 Players</SelectItem>
                  <SelectItem value="8">8 Players</SelectItem>
                  <SelectItem value="10">10 Players</SelectItem>
                  <SelectItem value="12">12 Players</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="question-time">Question Time Limit (seconds)</Label>
              <Input 
                id="question-time" 
                type="number" 
                value={settings.questionTime}
                onChange={(e) => handleSettingChange('questionTime', parseInt(e.target.value))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-start">Auto-start games when full</Label>
              <Switch 
                id="auto-start" 
                checked={settings.autoStart}
                onCheckedChange={(checked) => handleSettingChange('autoStart', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="two-factor">Require Two-Factor Authentication</Label>
              <Switch 
                id="two-factor" 
                checked={settings.twoFactor}
                onCheckedChange={(checked) => handleSettingChange('twoFactor', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-verification">Email Verification Required</Label>
              <Switch 
                id="email-verification" 
                checked={settings.emailVerification}
                onCheckedChange={(checked) => handleSettingChange('emailVerification', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="rate-limiting">Enable Rate Limiting</Label>
              <Switch 
                id="rate-limiting" 
                checked={settings.rateLimiting}
                onCheckedChange={(checked) => handleSettingChange('rateLimiting', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input 
                id="session-timeout" 
                type="number" 
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notification Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Switch 
                id="email-notifications" 
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <Switch 
                id="push-notifications" 
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="tournament-reminders">Tournament Reminders</Label>
              <Switch 
                id="tournament-reminders" 
                checked={settings.tournamentReminders}
                onCheckedChange={(checked) => handleSettingChange('tournamentReminders', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="weekly-reports">Weekly Reports</Label>
              <Switch 
                id="weekly-reports" 
                checked={settings.weeklyReports}
                onCheckedChange={(checked) => handleSettingChange('weeklyReports', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Appearance Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="default-theme">Default Theme</Label>
              <Select value={settings.defaultTheme} onValueChange={(value) => handleSettingChange('defaultTheme', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <Select value={settings.primaryColor} onValueChange={(value) => handleSettingChange('primaryColor', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="animations">Enable Animations</Label>
              <Switch 
                id="animations" 
                checked={settings.animations}
                onCheckedChange={(checked) => handleSettingChange('animations', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Database Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Database Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="backup-frequency">Backup Frequency</Label>
              <Select value={settings.backupFrequency} onValueChange={(value) => handleSettingChange('backupFrequency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="retention-days">Retention Period (days)</Label>
              <Input 
                id="retention-days" 
                type="number" 
                value={settings.retentionDays}
                onChange={(e) => handleSettingChange('retentionDays', parseInt(e.target.value))}
              />
            </div>
          </div>
          <Separator />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleResetToDefaults}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset to Defaults
            </Button>
            <Button onClick={handleSaveSettings} disabled={!hasChanges}>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

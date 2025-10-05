"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Palette,
  Download,
  Trash2,
  ArrowLeft,
  Save,
  Eye,
  EyeOff
} from "lucide-react"
import { useAi } from "@/hooks/use-ai"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"

export default function SettingsPage() {
  const { user, loading, signOut } = useAuth()
  const { aiEnabled, setAiEnabled, usage, refreshUsage } = useAi()
  const router = useRouter()
  const { toast } = useToast()
  
  const [profileData, setProfileData] = useState({
    full_name: user?.user_metadata?.full_name || "",
    email: user?.email || "",
  })
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    autoSave: true,
    darkMode: false,
    publicProfile: false,
  })
  
  const [isUpdating, setIsUpdating] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.user_metadata?.full_name || "",
        email: user.email || "",
      })
    }
  }, [user])

  const handleProfileUpdate = async () => {
    if (!user) return

    setIsUpdating(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profileData.full_name,
        }
      })

      if (error) throw error

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update Failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePasswordChange = async () => {
    if (!user) return

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match.",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      })

      if (error) throw error

      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
      })

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      console.error("Error updating password:", error)
      toast({
        title: "Update Failed",
        description: "Failed to update your password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.")) {
      return
    }

    setIsUpdating(true)
    try {
      // First delete all user data from the database
      const { error: deleteError } = await supabase
        .from("resumes")
        .delete()
        .eq("user_id", user?.id)

      if (deleteError) throw deleteError

      // Then delete the user account
      const { error } = await supabase.auth.admin.deleteUser(user?.id || "")

      if (error) throw error

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      })

      router.push("/auth")
    } catch (error) {
      console.error("Error deleting account:", error)
      toast({
        title: "Deletion Failed",
        description: "Failed to delete your account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user) {
    router.push("/auth")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.push("/profile")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your account preferences</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Settings
              </CardTitle>
              <CardDescription>
                Update your personal information and profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="text-lg">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-gray-600">Member since {new Date(user.created_at || "").toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={profileData.email}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-600 mt-1">Email cannot be changed</p>
                </div>

                <Button onClick={handleProfileUpdate} disabled={isUpdating}>
                  <Save className="w-4 h-4 mr-2" />
                  {isUpdating ? "Updating..." : "Update Profile"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Password Settings
              </CardTitle>
              <CardDescription>
                Change your account password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="new_password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new_password"
                    type={showPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                />
              </div>

              <Button onClick={handlePasswordChange} disabled={isUpdating}>
                <Save className="w-4 h-4 mr-2" />
                {isUpdating ? "Updating..." : "Change Password"}
              </Button>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Preferences
              </CardTitle>
              <CardDescription>
                Customize your experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="ai_enabled">AI Features</Label>
                  <p className="text-sm text-gray-600">Enable or disable AI features (requires login)</p>
                  {user && usage && (
                    <p className="text-xs text-gray-500 mt-1">Monthly credits: ${'{'}usage.totalUsdUsedThisMonth.toFixed(2){'}'} used / ${'{'}usage.monthUsdLimit.toFixed(2){'}'}</p>
                  )}
                </div>
                <Switch
                  id="ai_enabled"
                  checked={aiEnabled}
                  onCheckedChange={(checked) => setAiEnabled(checked)}
                  disabled={!user}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email_notifications">Email Notifications</Label>
                  <p className="text-sm text-gray-600">Receive email updates about your account</p>
                </div>
                <Switch
                  id="email_notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto_save">Auto Save</Label>
                  <p className="text-sm text-gray-600">Automatically save your resume changes</p>
                </div>
                <Switch
                  id="auto_save"
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoSave: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark_mode">Dark Mode</Label>
                  <p className="text-sm text-gray-600">Use dark theme (coming soon)</p>
                </div>
                <Switch
                  id="dark_mode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, darkMode: checked }))}
                  disabled
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="public_profile">Public Profile</Label>
                  <p className="text-sm text-gray-600">Allow others to view your profile</p>
                </div>
                <Switch
                  id="public_profile"
                  checked={settings.publicProfile}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, publicProfile: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Account Actions
              </CardTitle>
              <CardDescription>
                Manage your account and data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Export My Data
              </Button>

              <Button variant="outline" onClick={handleSignOut} className="w-full justify-start">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Sign Out
              </Button>

              <Separator />

              <Button 
                variant="destructive" 
                onClick={handleDeleteAccount}
                disabled={isUpdating}
                className="w-full justify-start"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isUpdating ? "Deleting..." : "Delete Account"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 
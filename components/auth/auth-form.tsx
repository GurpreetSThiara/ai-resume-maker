"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { TermsModal } from "@/components/auth/terms-modal"
import { PrivacyModal } from "@/components/auth/privacy-modal"
import { supabase } from "@/lib/supabase/client"
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react"
import { CREATE_RESUME } from "@/config/urls"
import { SHOW_SUCCESS, SHOW_ERROR } from "@/utils/toast"
import { GoogleOAuthProvider, GoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google"

interface AuthFormProps {
  onSuccess?: () => void
}

function AuthFormContent({ onSuccess }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  })

  const [signUpData, setSignUpData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  })
  const [acceptedPolicy, setAcceptedPolicy] = useState(false)
  const [isTermsOpen, setIsTermsOpen] = useState(false)
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: signInData.email,
        password: signInData.password,
      })

      if (error) throw error

      SHOW_SUCCESS({ title: "Welcome back!", description: "Successfully signed in!" })
      setSuccess("Successfully signed in!")
      onSuccess?.()
    } catch (error: any) {
      SHOW_ERROR({ title: "Sign in failed", description: error.message })
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    if (!acceptedPolicy) {
      SHOW_ERROR({ title: "Accept policies", description: "You must accept our terms and privacy policy to create an account" })
      setError("You must accept our terms and privacy policy to create an account")
      setIsLoading(false)
      return
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      SHOW_ERROR({ title: "Password mismatch", description: "Passwords do not match" })
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (signUpData.password.length < 6) {
      SHOW_ERROR({ title: "Password too short", description: "Password must be at least 6 characters long" })
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          data: {
            full_name: signUpData.fullName,
          },
          // Persist session via cookie for 30 days after email confirmation
          emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}${CREATE_RESUME}`,
        },
      })

      if (error) throw error

      // Ensure we do not create duplicate accounts for the same email.
      // Supabase auth already enforces unique emails unless configured otherwise.
      // We mirror user in profiles with unique email too (see schema), so duplicates are prevented at DB level.

      SHOW_SUCCESS({ title: "Account created!", description: "Check your email for the confirmation link!" })
      setSuccess("Check your email for the confirmation link!")
    } catch (error: any) {
      SHOW_ERROR({ title: "Sign up failed", description: error.message })
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async (credentialResponse: any) => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: credentialResponse.credential,
      })

      if (error) throw error
      
      SHOW_SUCCESS({ title: "Welcome!", description: "Successfully signed in with Google!" })
      setSuccess("Successfully signed in with Google!")
      onSuccess?.()
    } catch (error: any) {
      SHOW_ERROR({ title: "Google sign in failed", description: error.message })
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <Card className="w-full shadow-none border-0 ">
        <CardHeader className="text-center ">
          {/* <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Resume Builder
          </CardTitle> */}
          {/* <CardDescription>Create your professional resume with our easy-to-use builder</CardDescription> */}
        </CardHeader>
        <CardContent className="shadow-none">
          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signInData.email}
                      onChange={(e) => setSignInData((prev) => ({ ...prev, email: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={signInData.password}
                      onChange={(e) => setSignInData((prev) => ({ ...prev, password: e.target.value }))}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full mb-6" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={signUpData.fullName}
                      onChange={(e) => setSignUpData((prev) => ({ ...prev, fullName: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData((prev) => ({ ...prev, email: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData((prev) => ({ ...prev, password: e.target.value }))}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <Checkbox
                    id="signup-accept-policy"
                    checked={acceptedPolicy}
                    onCheckedChange={(checked) => setAcceptedPolicy(!!checked)}
                    className="mt-1"
                  />
                  <Label
                    htmlFor="signup-accept-policy"
                    className="font-normal text-xs text-gray-600 leading-relaxed cursor-pointer"
                  >
                    I agree to the
                    {" "}
                    <button
                      type="button"
                      onClick={() => setIsTermsOpen(true)}
                      className="text-blue-600 hover:text-blue-700 underline-offset-2 hover:underline font-medium"
                    >
                      Terms of Use
                    </button>
                    {" "}
                    and
                    {" "}
                    <button
                      type="button"
                      onClick={() => setIsPrivacyOpen(true)}
                      className="text-blue-600 hover:text-blue-700 underline-offset-2 hover:underline font-medium"
                    >
                      Privacy Policy
                    </button>
                    .
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="w-full">
              <GoogleLogin
                onSuccess={handleGoogleSignIn}
                onError={() => {
                  SHOW_ERROR({ title: "Google sign in failed", description: "Failed to sign in with Google" })
                  setError("Failed to sign in with Google")
                }}
                useOneTap
                theme="filled_blue"
                text="signin_with"
                shape="rectangular"
                width="100%"
                locale="en"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <TermsModal open={isTermsOpen} onOpenChange={setIsTermsOpen} />
      <PrivacyModal open={isPrivacyOpen} onOpenChange={setIsPrivacyOpen} />
    </div>
  )
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <AuthFormContent onSuccess={onSuccess} />
    </GoogleOAuthProvider>
  )
}

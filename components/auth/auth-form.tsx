"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { TermsModal } from "@/components/auth/terms-modal"
import { PrivacyModal } from "@/components/auth/privacy-modal"
import { supabase } from "@/lib/supabase/client"
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { CREATE_RESUME } from "@/config/urls"
import { SHOW_SUCCESS, SHOW_ERROR } from "@/utils/toast"
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"

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
  const [activeTab, setActiveTab] = useState("signin")

  // Google sign-in creates an account on first use, so it must respect the same
  // policy acceptance the email signup form enforces. Only gated on the Sign Up
  // tab — returning users signing in have already accepted.
  const googleBlockedByPolicy = activeTab === "signup" && !acceptedPolicy
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
    // Defence in depth: the button is also disabled in this state, but the guard
    // lives here too so no account can be created without policy acceptance even
    // if the credential arrives another way (e.g. the One Tap prompt).
    if (googleBlockedByPolicy) {
      SHOW_ERROR({ title: "Accept policies", description: "You must accept our terms and privacy policy to create an account" })
      setError("You must accept our terms and privacy policy to create an account")
      return
    }

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

  const isSignUp = activeTab === "signup"

  return (
    <div className="w-full">
      {/* Brand header — tinted with the site's own primary rather than the
          off-brand purple/blue gradient this modal used to carry. */}
      <div className="relative overflow-hidden border-b border-border bg-primary/5 px-6 pb-6 pt-8 text-center sm:rounded-t-2xl">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
        />
        <div className="relative">
          <Logo width={44} height={44} className="mx-auto mb-4 h-11 w-11 rounded-xl shadow-lg shadow-primary/20" />
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            {isSignUp ? "Create your free account" : "Welcome back"}
          </h2>
          <p className="mx-auto mt-1.5 max-w-xs text-sm text-muted-foreground">
            {isSignUp
              ? "Save your resumes to the cloud and pick up on any device."
              : "Sign in to access your saved resumes and portfolios."}
          </p>
        </div>
      </div>

      <div className="px-6 pb-8 pt-6">
        {error && (
          <Alert className="mb-4 border-destructive/30 bg-destructive/10">
            <AlertDescription className="text-destructive">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 border-primary/30 bg-primary/10">
            <AlertDescription className="text-primary">{success}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-5 grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" size="lg" className="mt-1 w-full" disabled={isLoading}>
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
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                  className="mt-0.5 border-border"
                />
                <Label
                  htmlFor="signup-accept-policy"
                  className="font-normal text-xs leading-relaxed text-muted-foreground cursor-pointer"
                >
                  I agree to the
                  {" "}
                  <button
                    type="button"
                    onClick={() => setIsTermsOpen(true)}
                    className="font-medium text-primary underline-offset-2 hover:underline"
                  >
                    Terms of Use
                  </button>
                  {" "}
                  and
                  {" "}
                  <button
                    type="button"
                    onClick={() => setIsPrivacyOpen(true)}
                    className="font-medium text-primary underline-offset-2 hover:underline"
                  >
                    Privacy Policy
                  </button>
                  .
                </Label>
              </div>

              <Button type="submit" size="lg" className="mt-1 w-full" disabled={isLoading}>
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

        <div className="mt-7">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div
            className={googleBlockedByPolicy ? "pointer-events-none w-full opacity-50" : "w-full"}
            aria-disabled={googleBlockedByPolicy}
          >
            <GoogleLogin
              onSuccess={handleGoogleSignIn}
              onError={() => {
                SHOW_ERROR({ title: "Google sign in failed", description: "Failed to sign in with Google" })
                setError("Failed to sign in with Google")
              }}
              // One Tap can create an account in a single tap, so it stays off
              // until the policy checkbox is ticked on the Sign Up tab.
              useOneTap={!googleBlockedByPolicy}
              theme="outline"
              text="signin_with"
              shape="rectangular"
              width="100%"
              locale="en"
            />
          </div>

          {googleBlockedByPolicy ? (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Accept the Terms of Use and Privacy Policy above to continue with Google.
            </p>
          ) : (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              By continuing with Google you agree to our{" "}
              <button
                type="button"
                onClick={() => setIsTermsOpen(true)}
                className="text-primary underline-offset-2 hover:underline"
              >
                Terms of Use
              </button>{" "}
              and{" "}
              <button
                type="button"
                onClick={() => setIsPrivacyOpen(true)}
                className="text-primary underline-offset-2 hover:underline"
              >
                Privacy Policy
              </button>
              .
            </p>
          )}
        </div>
      </div>

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

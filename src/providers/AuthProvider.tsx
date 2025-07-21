// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { Session, User } from '@supabase/supabase-js';
// import { supabase } from '../lib/supabase';
// import { ActivityIndicator } from 'react-native';
// import { View } from 'react-native';
// import { useQuery } from '@tanstack/react-query';
// import { getProfileById } from '@/services/profiles';
// import { Tables } from '@/types/database.types';

// type AuthContextType = {
//   user: User | null;
//   isAuthenticated: boolean;
//   profile: Tables<'profiles'> | null;
// };

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   isAuthenticated: false,
//   profile: null,
// });

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   const { data: profile } = useQuery({
//     queryKey: ['profile', user?.id],
//     queryFn: () => getProfileById(user!.id),
//   });

//   useEffect(() => {
//     // Get initial session
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       if (session) {
//         setUser(session.user);
//         setIsAuthenticated(true);
//       }
//       setIsLoading(false);
//     });

//     // Listen for auth changes
//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       if (session) {
//         setUser(session.user);
//         setIsAuthenticated(true);
//       } else {
//         setUser(null);
//         setIsAuthenticated(false);
//       }
//     });

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, []);

//   if (isLoading) {
//     return (
//       <View className='flex-1 items-center justify-center'>
//         <ActivityIndicator size='large' />
//       </View>
//     );
//   }

//   return (
//     <AuthContext.Provider value={{ user, isAuthenticated, profile }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };



// import React, { createContext, useContext, useEffect, useState } from "react";
// import { Session, User } from "@supabase/supabase-js";
// import { supabase } from "../lib/supabase";
// import { View } from "react-native";
// import { ActivityIndicator } from "react-native";
// import { getProfileById } from "@/services/profiles";
// import { useQuery } from "@tanstack/react-query";
// import { Tables } from "@/types/database.types";

// type AuthContextType = {
//   user: User | null;
//   isAuthenticated: boolean;
//   profile: Tables<"profiles"> | null;
//   logout: () => Promise<void>;
// };

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   isAuthenticated: false,
//   profile: null,
//   logout: async () => {},
// });

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   const { data: profile } = useQuery({
//     queryKey: ["profile", user?.id],
//     queryFn: () => getProfileById(user!.id),
//   });

//   useEffect(() => {
//     // Get initial session
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       if (session) {
//         setUser(session.user);
//         setIsAuthenticated(true);
//       }
//       setIsLoading(false);
//     });

//     // Listen for auth changes
//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       if (session) {
//         setUser(session.user);
//         setIsAuthenticated(true);
//       } else {
//         setUser(null);
//         setIsAuthenticated(false);
//       }
//     });

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, []);

//   const logout = async () => {
//     await supabase.auth.signOut();
//     setUser(null);
//     setIsAuthenticated(false);
//   };

//   if (isLoading) {
//     return (
//       <View className="flex-1 items-center justify-center">
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <AuthContext.Provider value={{ user, isAuthenticated, profile, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { Button, View, Text } from "react-native";
import { ActivityIndicator } from "react-native";
import { getProfileById, createProfile } from "@/services/profiles";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Tables } from "@/types/database.types";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  profile: Tables<"profiles"> | null;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  profile: null,
  logout: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Only fetch profile if user exists
  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      // Try to get existing profile
      const existingProfile = await getProfileById(user.id);
      
      if (existingProfile) {
        return existingProfile;
      }
      
      // If profile doesn't exist, create it
      console.log("Profile not found, creating new profile...");
      try {
        const newProfile = await createProfile({
          id: user.id,
          // Remove email and other fields until we know what columns exist
        });
        return newProfile;
      } catch (createError) {
        console.error("Error creating profile:", createError);
        throw createError; // Re-throw to trigger react-query error handling
      }
    },
    enabled: !!user?.id, // Only run query if user exists
    retry: 3, // Retry failed requests
    retryDelay: 1000, // Wait 1 second between retries
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        setUser(session.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        // Clear profile query cache when logging out
        queryClient.removeQueries({ queryKey: ["profile"] });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Show loading while initial auth is loading OR while profile is loading for authenticated users
  if (isLoading || (isAuthenticated && profileLoading)) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Show error if profile failed to load
  if (profileError) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500 text-center mb-4">
          Failed to load profile. Please try again.
        </Text>
        <Button 
          title="Retry" 
          onPress={() => queryClient.invalidateQueries({ queryKey: ["profile"] })}
        />
      </View>
    );
  }

  // Don't render children if user is authenticated but profile is still null
  if (isAuthenticated && !profile) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-gray-600">Setting up your profile...</Text>
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, profile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
// import { supabase } from '@/lib/supabase';
// import { TablesInsert } from '@/types/supabase';

// export const getProfileById = async (id: string) => {
//   const { data } = await supabase
//     .from('profiles')
//     .select('*')
//     .eq('id', id)
//     // .single()
//     .throwOnError();

//   return data;
// };

// export const updateProfile = async (
//   id: string,
//   updatedProfile: TablesInsert<'profiles'>
// ) => {
//   const { data } = await supabase
//     .from('profiles')
//     .update(updatedProfile)
//     .eq('id', id)
//     .throwOnError()
//     .select('*')
//     // .single();

//   return data;
// };




import { supabase } from '@/lib/supabase';
import { TablesInsert } from '@/types/supabase';

export const getProfileById = async (id: string) => {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle() // Use maybeSingle() to return null if no profile found
    .throwOnError();

  return data;
};

export const createProfile = async (profileData: {
  id: string;
  email?: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
}) => {
  // Include required fields based on the error messages
  const { data } = await supabase
    .from('profiles')
    .insert({
      id: profileData.id,
      updated_at: new Date().toISOString(), // Add required updated_at field
      // Add other fields here once you know what columns exist
    })
    .select()
    .single()
    .throwOnError();

  return data;
};

export const updateProfile = async (
  id: string,
  updatedProfile: TablesInsert<'profiles'>
) => {
  const { data } = await supabase
    .from('profiles')
    .update(updatedProfile)
    .eq('id', id)
    .select('*')
    .single()
    .throwOnError();

  return data;
};
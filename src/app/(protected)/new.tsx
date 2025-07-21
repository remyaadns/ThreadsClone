// import { supabase } from '@/lib/supabase';
// import { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Pressable,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
//   Image,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useAuth } from '@/providers/AuthProvider';
// import { Entypo } from '@expo/vector-icons';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { router } from 'expo-router';
// import { createPost } from '@/services/posts';
// import * as ImagePicker from 'expo-image-picker';
// import { getProfileById } from '@/services/profiles';
// import SupabaseImage from '@/components/SupabaseImage';

// export default function NewPostScreen() {
//   const [text, setText] = useState('');
//   const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

//   const { user, profile } = useAuth();

//   const queryClient = useQueryClient();

//   const { mutate, isPending, error } = useMutation({
//     mutationFn: async () => {
//       let imagePath = undefined;
//       if (image) {
//         imagePath = await uploadImage();
//       }

//       return createPost({
//         content: text,
//         user_id: user!.id,
//         images: imagePath ? [imagePath] : undefined,
//       });
//     },
//     onSuccess: (data) => {
//       setText('');
//       router.back();
//       queryClient.invalidateQueries({ queryKey: ['posts'] });
//     },
//     onError: (error) => {
//       console.error(error);
//       // Alert.alert('Error', error.message);
//     },
//   });

//   const pickImage = async () => {
//     // No permissions request is necessary for launching the image library
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ['images'],
//       allowsEditing: true,
//       quality: 1,
//     });

//     console.log(result);

//     if (!result.canceled) {
//       setImage(result.assets[0]);
//     }
//   };

//   const uploadImage = async () => {
//     if (!image) return;
//     const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer());

//     const fileExt = image.uri?.split('.').pop()?.toLowerCase() ?? 'jpeg';
//     const path = `${Date.now()}.${fileExt}`;

//     const { data, error: uploadError } = await supabase.storage
//       .from('media')
//       .upload(path, arraybuffer, {
//         contentType: image.mimeType ?? 'image/jpeg',
//       });
//     if (uploadError) {
//       throw uploadError;
//     }

//     return data.path;
//   };

//   return (
//     <SafeAreaView edges={['bottom']} className='p-4 flex-1'>
//       <KeyboardAvoidingView
//         className='flex-1'
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 140 : 0}
//       >
//         <View className='flex-row  gap-4'>
//           <SupabaseImage
//             bucket='avatars'
//             path={profile?.avatar_url}
//             className='w-12 h-12 rounded-full'
//             transform={{ width: 50, height: 50 }}
//           />

//           <View>
//             <Text className='text-white text-lg font-bold'>
//               {profile.username}
//             </Text>

//             <TextInput
//               value={text}
//               onChangeText={setText}
//               placeholder='What is on your mind?'
//               placeholderTextColor='gray'
//               className='text-white text-lg'
//               multiline
//               numberOfLines={4}
//             />

//             {image && (
//               <Image
//                 source={{ uri: image.uri }}
//                 className='w-1/2 rounded-lg my-4'
//                 style={{ aspectRatio: image.width / image.height }}
//               />
//             )}

//             {error && (
//               <Text className='text-red-500 text-sm mt-4'>{error.message}</Text>
//             )}

//             <View className='flex-row items-center gap-2 mt-4'>
//               <Entypo
//                 onPress={pickImage}
//                 name='images'
//                 size={20}
//                 color='gray'
//               />
//             </View>
//           </View>
//         </View>

//         <View className='mt-auto'>
//           <Pressable
//             onPress={() => mutate()}
//             className={`${
//               isPending ? 'bg-white/50' : 'bg-white'
//             } p-3 px-6 self-end rounded-full`}
//             disabled={isPending}
//           >
//             <Text className='text-black font-bold'>Post</Text>
//           </Pressable>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }


// this is the new New.tsx which handles carousels/mutliple posts 
// import { supabase } from '@/lib/supabase';
// import { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Pressable,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
//   Image,
//   ScrollView,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useAuth } from '@/providers/AuthProvider';
// import Entypo from '@expo/vector-icons/Entypo';
// import { Ionicons } from '@expo/vector-icons';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { router } from 'expo-router';
// import { createPost } from '@/services/posts';
// import * as ImagePicker from 'expo-image-picker';
// import { getProfileById } from '@/services/profiles';
// import SupabaseImage from '@/components/SupabaseImage';

// export default function NewPostScreen() {
//   const [text, setText] = useState('');
//   const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);

//   const { user, profile } = useAuth();

//   const queryClient = useQueryClient();

//   const { mutate, isPending, error } = useMutation({
//     mutationFn: async () => {
//       let imagePaths: string[] = [];
      
//       if (images.length > 0) {
//         // Upload all images and collect their paths
//         imagePaths = await Promise.all(
//           images.map(image => uploadImage(image))
//         );
//       }

//       return createPost({
//         content: text,
//         user_id: user!.id,
//         images: imagePaths.length > 0 ? imagePaths : undefined,
//       });
//     },
//     onSuccess: (data) => {
//       setText('');
//       setImages([]);
//       router.back();
//       queryClient.invalidateQueries({ queryKey: ['posts'] });
//     },
//     onError: (error) => {
//       console.error(error);
//       // Alert.alert('Error', error.message);
//     },
//   });

//   const pickImages = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ['images'],
//       allowsEditing: false, // Allow multiple selection
//       allowsMultipleSelection: true, // Enable multiple selection
//       selectionLimit: 10, // Max 10 images like Instagram
//       quality: 1,
//     });

//     console.log(result);

//     if (!result.canceled) {
//       setImages(result.assets);
//     }
//   };

//   const uploadImage = async (image: ImagePicker.ImagePickerAsset) => {
//     const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer());

//     const fileExt = image.uri?.split('.').pop()?.toLowerCase() ?? 'jpeg';
//     const path = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

//     const { data, error: uploadError } = await supabase.storage
//       .from('media')
//       .upload(path, arraybuffer, {
//         contentType: image.mimeType ?? 'image/jpeg',
//       });
    
//     if (uploadError) {
//       throw uploadError;
//     }

//     return data.path;
//   };

//   const removeImage = (index: number) => {
//     setImages(images.filter((_, i) => i !== index));
//   };

//   return (
//     <SafeAreaView edges={['bottom']} className='p-4 flex-1'>
//       <KeyboardAvoidingView
//         className='flex-1'
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 140 : 0}
//       >
//         <View className='flex-row gap-4'>
//           <SupabaseImage
//             bucket='avatars'
//             path={profile?.avatar_url}
//             className='w-12 h-12 rounded-full'
//             transform={{ width: 50, height: 50 }}
//           />

//           <View className='flex-1'>
//             <Text className='text-white text-lg font-bold'>
//               {profile?.username}
//             </Text>

//             <TextInput
//               value={text}
//               onChangeText={setText}
//               placeholder='What is on your mind?'
//               placeholderTextColor='gray'
//               className='text-white text-lg'
//               multiline
//               numberOfLines={4}
//             />

//             {/* Multiple Images Preview */}
//             {images.length > 0 && (
//               <ScrollView 
//                 horizontal 
//                 showsHorizontalScrollIndicator={false}
//                 className='mt-4'
//               >
//                 <View className='flex-row gap-2'>
//                   {images.map((image, index) => (
//                     <View key={index} className='relative'>
//                       <Image
//                         source={{ uri: image.uri }}
//                         className='w-20 h-20 rounded-lg'
//                         style={{ aspectRatio: 1 }}
//                       />
//                       {/* Remove button */}
//                       <Pressable
//                         onPress={() => removeImage(index)}
//                         className='absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center'
//                       >
//                         <Ionicons name='close' size={12} color='white' />
//                       </Pressable>
//                     </View>
//                   ))}
//                 </View>
//               </ScrollView>
//             )}

//             {error && (
//               <Text className='text-red-500 text-sm mt-4'>{error.message}</Text>
//             )}

//             <View className='flex-row items-center gap-2 mt-4'>
//               <Pressable onPress={pickImages} className='flex-row items-center'>
//                 {/* <Entypo name='image' size={30} color='gray' /> */}
//                  <Ionicons name='images' size={20} color='#d1d5db' />
//                 {images.length > 0 && (
//                   <Text className='text-gray-400 ml-2'>
//                     {images.length} selected
//                   </Text>
//                 )}
//               </Pressable>
//             </View>
//           </View>
//         </View>

//         <View className='mt-py-4'>
//           <Pressable
//             onPress={() => mutate()}
//             className={`${
//               isPending ? 'bg-white/50' : 'bg-white'
//             } p-3 px-6 self-end rounded-full`}
//             disabled={isPending}
//           >
//             <Text className='text-black font-bold'>
//               {isPending ? 'Posting...' : 'Post'}
//             </Text>
//           </Pressable>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }


// /////tester - works but slow
// import { supabase } from '@/lib/supabase';
// import { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Pressable,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
//   Image,
//   ScrollView,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useAuth } from '@/providers/AuthProvider';
// import Entypo from '@expo/vector-icons/Entypo';
// import { Ionicons } from '@expo/vector-icons';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { router } from 'expo-router';
// import { createPost } from '@/services/posts';
// import * as ImagePicker from 'expo-image-picker';
// import { getProfileById } from '@/services/profiles';
// import SupabaseImage from '@/components/SupabaseImage';

// export default function NewPostScreen() {
//   const [text, setText] = useState('');
//   const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
//   const [uploadProgress, setUploadProgress] = useState<string>('');

//   const { user, profile } = useAuth();
//   const queryClient = useQueryClient();

//   const { mutate, isPending, error } = useMutation({
//     mutationFn: async () => {
//       let imagePaths: string[] = [];
      
//       if (images.length > 0) {
//         setUploadProgress('Uploading images...');
        
//         // Upload images sequentially to avoid overwhelming the connection
//         for (let i = 0; i < images.length; i++) {
//           const image = images[i];
//           setUploadProgress(`Uploading image ${i + 1} of ${images.length}...`);
          
//           try {
//             const path = await uploadImage(image);
//             imagePaths.push(path);
//             console.log(`Image ${i + 1} uploaded successfully:`, path);
//           } catch (error) {
//             console.error(`Failed to upload image ${i + 1}:`, error);
//             throw new Error(`Failed to upload image ${i + 1}: ${error.message}`);
//           }
//         }
        
//         setUploadProgress('Creating post...');
//       }

//       return createPost({
//         content: text,
//         user_id: user!.id,
//         images: imagePaths.length > 0 ? imagePaths : undefined,
//       });
//     },
//     onSuccess: (data) => {
//       console.log('Post created successfully:', data);
//       setText('');
//       setImages([]);
//       setUploadProgress('');
//       router.back();
//       queryClient.invalidateQueries({ queryKey: ['posts'] });
//     },
//     onError: (error) => {
//       console.error('Post creation error:', error);
//       setUploadProgress('');
//       Alert.alert('Error', error.message || 'Failed to create post');
//     },
//   });

//   const pickImages = async () => {
//     console.log('Opening image picker...');
    
//     // Request permissions first
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
//       return;
//     }

//     try {
//       let result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ['images'],
//         allowsEditing: false,
//         allowsMultipleSelection: true,
//         selectionLimit: 10,
//         quality: 0.8, // Reduce quality to help with upload
//       });

//       console.log('Image picker result:', result);

//       if (!result.canceled && result.assets) {
//         console.log(`Selected ${result.assets.length} images`);
//         setImages(result.assets);
//       }
//     } catch (error) {
//       console.error('Error picking images:', error);
//       Alert.alert('Error', 'Failed to pick images');
//     }
//   };

//   const uploadImage = async (image: ImagePicker.ImagePickerAsset) => {
//     console.log('Starting upload for image:', image.uri);
    
//     try {
//       // Check if image URI is valid
//       if (!image.uri) {
//         throw new Error('Invalid image URI');
//       }

//       // Fetch the image data
//       const response = await fetch(image.uri);
//       if (!response.ok) {
//         throw new Error(`Failed to fetch image: ${response.status}`);
//       }
      
//       const arraybuffer = await response.arrayBuffer();
//       console.log('Image data fetched, size:', arraybuffer.byteLength);

//       // Check file size (limit to 5MB)
//       const maxSize = 5 * 1024 * 1024; // 5MB
//       if (arraybuffer.byteLength > maxSize) {
//         throw new Error('Image too large. Please choose a smaller image.');
//       }

//       // Generate unique filename
//       const fileExt = image.uri?.split('.').pop()?.toLowerCase() ?? 'jpeg';
//       const timestamp = Date.now();
//       const randomString = Math.random().toString(36).substr(2, 9);
//       const path = `${timestamp}-${randomString}.${fileExt}`;

//       console.log('Uploading to path:', path);

//       // Upload to Supabase
//       const { data, error: uploadError } = await supabase.storage
//         .from('media')
//         .upload(path, arraybuffer, {
//           contentType: image.mimeType ?? 'image/jpeg',
//           upsert: false, // Don't overwrite existing files
//         });
      
//       if (uploadError) {
//         console.error('Supabase upload error:', uploadError);
//         throw new Error(`Upload failed: ${uploadError.message}`);
//       }

//       if (!data?.path) {
//         throw new Error('Upload succeeded but no path returned');
//       }

//       console.log('Upload successful, path:', data.path);
//       return data.path;
      
//     } catch (error) {
//       console.error('Upload error:', error);
//       throw error;
//     }
//   };

//   const removeImage = (index: number) => {
//     console.log('Removing image at index:', index);
//     setImages(images.filter((_, i) => i !== index));
//   };

//   const canPost = text.trim().length > 0 || images.length > 0;

//   return (
//     <SafeAreaView edges={['bottom']} className='p-4 flex-1'>
//       <KeyboardAvoidingView
//         className='flex-1'
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 140 : 0}
//       >
//         <View className='flex-row gap-4'>
//           <SupabaseImage
//             bucket='avatars'
//             path={profile?.avatar_url}
//             className='w-12 h-12 rounded-full'
//             transform={{ width: 50, height: 50 }}
//           />

//           <View className='flex-1'>
//             <Text className='text-white text-lg font-bold'>
//               {profile?.username}
//             </Text>

//             <TextInput
//               value={text}
//               onChangeText={setText}
//               placeholder='What is on your mind?'
//               placeholderTextColor='gray'
//               className='text-white text-lg'
//               multiline
//               numberOfLines={4}
//               editable={!isPending}
//             />

//             {/* Multiple Images Preview */}
//             {images.length > 0 && (
//               <ScrollView 
//                 horizontal 
//                 showsHorizontalScrollIndicator={false}
//                 className='mt-4'
//               >
//                 <View className='flex-row gap-2'>
//                   {images.map((image, index) => (
//                     <View key={index} className='relative'>
//                       <Image
//                         source={{ uri: image.uri }}
//                         className='w-20 h-20 rounded-lg'
//                         style={{ aspectRatio: 1 }}
//                       />
//                       {/* Remove button */}
//                       <Pressable
//                         onPress={() => removeImage(index)}
//                         className='absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center'
//                         disabled={isPending}
//                       >
//                         <Ionicons name='close' size={12} color='white' />
//                       </Pressable>
//                     </View>
//                   ))}
//                 </View>
//               </ScrollView>
//             )}

//             {/* Upload progress */}
//             {uploadProgress && (
//               <Text className='text-blue-400 text-sm mt-2'>{uploadProgress}</Text>
//             )}

//             {/* Error display */}
//             {error && (
//               <Text className='text-red-500 text-sm mt-2'>{error.message}</Text>
//             )}

//             <View className='flex-row items-center gap-2 mt-4'>
//               <Pressable 
//                 onPress={pickImages} 
//                 className='flex-row items-center'
//                 disabled={isPending}
//               >
//                 <Ionicons name='images' size={20} color='#d1d5db' />
//                 {images.length > 0 && (
//                   <Text className='text-gray-400 ml-2'>
//                     {images.length} selected
//                   </Text>
//                 )}
//               </Pressable>
//             </View>
//           </View>
//         </View>

//         <View className='mt-4'>
//           <Pressable
//             onPress={() => mutate()}
//             className={`${
//               !canPost || isPending ? 'bg-white/50' : 'bg-white'
//             } p-3 px-6 self-end rounded-full`}
//             disabled={!canPost || isPending}
//           >
//             <Text className='text-black font-bold'>
//               {isPending ? 'Posting...' : 'Post'}
//             </Text>
//           </Pressable>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }


/////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
/// faster processing ----- slower upload
// import { supabase } from '@/lib/supabase';
// import { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Pressable,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
//   Image,
//   ScrollView,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useAuth } from '@/providers/AuthProvider';
// import Entypo from '@expo/vector-icons/Entypo';
// import { Ionicons } from '@expo/vector-icons';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { router } from 'expo-router';
// import { createPost } from '@/services/posts';
// import * as ImagePicker from 'expo-image-picker';
// import { getProfileById } from '@/services/profiles';
// import SupabaseImage from '@/components/SupabaseImage';

// export default function NewPostScreen() {
//   const [text, setText] = useState('');
//   const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
//   const [uploadProgress, setUploadProgress] = useState<string>('');
//   const [hasPermission, setHasPermission] = useState<boolean | null>(null);

//   const { user, profile } = useAuth();
//   const queryClient = useQueryClient();

//   // Check permissions on mount
//   useEffect(() => {
//     (async () => {
//       const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
//       setHasPermission(status === 'granted');
//     })();
//   }, []);

//   const { mutate, isPending, error } = useMutation({
//     mutationFn: async () => {
//       let imagePaths: string[] = [];
      
//       if (images.length > 0) {
//         setUploadProgress('Uploading images...');
        
//         // Upload images sequentially to avoid overwhelming the connection
//         for (let i = 0; i < images.length; i++) {
//           const image = images[i];
//           setUploadProgress(`Uploading image ${i + 1} of ${images.length}...`);
          
//           try {
//             const path = await uploadImage(image);
//             imagePaths.push(path);
//             console.log(`Image ${i + 1} uploaded successfully:`, path);
//           } catch (error) {
//             console.error(`Failed to upload image ${i + 1}:`, error);
//             throw new Error(`Failed to upload image ${i + 1}: ${error.message}`);
//           }
//         }
        
//         setUploadProgress('Creating post...');
//       }

//       return createPost({
//         content: text,
//         user_id: user!.id,
//         images: imagePaths.length > 0 ? imagePaths : undefined,
//       });
//     },
//     onSuccess: (data) => {
//       console.log('Post created successfully:', data);
//       setText('');
//       setImages([]);
//       setUploadProgress('');
//       router.back();
//       queryClient.invalidateQueries({ queryKey: ['posts'] });
//     },
//     onError: (error) => {
//       console.error('Post creation error:', error);
//       setUploadProgress('');
//       Alert.alert('Error', error.message || 'Failed to create post');
//     },
//   });

//   const pickImages = async () => {
//     console.log('Opening image picker...');
    
//     // Request permissions if not already granted
//     if (hasPermission === false) {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
//         return;
//       }
//       setHasPermission(true);
//     }

//     try {
//       let result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ['images'],
//         allowsEditing: false,
//         allowsMultipleSelection: true,
//         selectionLimit: 5, // Reduce to 5 images for better performance
//         quality: 0.5, // Lower quality for faster processing
//         // Add these for better performance
//         exif: false, // Don't include EXIF data
//         base64: false, // Don't generate base64
//         allowsEditing: false,
//       });

//       console.log('Image picker result:', result);

//       if (!result.canceled && result.assets) {
//         console.log(`Selected ${result.assets.length} images`);
//         setImages(result.assets);
//       }
//     } catch (error) {
//       console.error('Error picking images:', error);
//       Alert.alert('Error', 'Failed to pick images');
//     }
//   };

//   const uploadImage = async (image: ImagePicker.ImagePickerAsset) => {
//     console.log('Starting upload for image:', image.uri);
    
//     try {
//       // Check if image URI is valid
//       if (!image.uri) {
//         throw new Error('Invalid image URI');
//       }

//       // For React Native, use different approach for file handling
//       let fileData;
      
//       if (Platform.OS === 'web') {
//         // Web handling
//         const response = await fetch(image.uri);
//         if (!response.ok) {
//           throw new Error(`Failed to fetch image: ${response.status}`);
//         }
//         fileData = await response.arrayBuffer();
//       } else {
//         // Mobile handling - use FileSystem for better performance
//         const response = await fetch(image.uri);
//         if (!response.ok) {
//           throw new Error(`Failed to fetch image: ${response.status}`);
//         }
//         fileData = await response.blob();
//       }

//       console.log('Image data fetched, size:', fileData.size || fileData.byteLength);

//       // Check file size (limit to 3MB for better performance)
//       const maxSize = 3 * 1024 * 1024; // 3MB
//       const fileSize = fileData.size || fileData.byteLength;
//       if (fileSize > maxSize) {
//         throw new Error('Image too large. Please choose a smaller image.');
//       }

//       // Generate unique filename
//       const fileExt = image.uri?.split('.').pop()?.toLowerCase() ?? 'jpeg';
//       const timestamp = Date.now();
//       const randomString = Math.random().toString(36).substr(2, 9);
//       const path = `${timestamp}-${randomString}.${fileExt}`;

//       console.log('Uploading to path:', path);

//       // Upload to Supabase
//       const { data, error: uploadError } = await supabase.storage
//         .from('media')
//         .upload(path, fileData, {
//           contentType: image.mimeType ?? 'image/jpeg',
//           upsert: false,
//         });
      
//       if (uploadError) {
//         console.error('Supabase upload error:', uploadError);
//         throw new Error(`Upload failed: ${uploadError.message}`);
//       }

//       if (!data?.path) {
//         throw new Error('Upload succeeded but no path returned');
//       }

//       console.log('Upload successful, path:', data.path);
//       return data.path;
      
//     } catch (error) {
//       console.error('Upload error:', error);
//       throw error;
//     }
//   };

//   const removeImage = (index: number) => {
//     console.log('Removing image at index:', index);
//     setImages(images.filter((_, i) => i !== index));
//   };

//   const canPost = text.trim().length > 0 || images.length > 0;

//   return (
//     <SafeAreaView edges={['bottom']} className='p-4 flex-1'>
//       <KeyboardAvoidingView
//         className='flex-1'
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 140 : 0}
//       >
//         <View className='flex-row gap-4'>
//           <SupabaseImage
//             bucket='avatars'
//             path={profile?.avatar_url}
//             className='w-12 h-12 rounded-full'
//             transform={{ width: 50, height: 50 }}
//           />

//           <View className='flex-1'>
//             <Text className='text-white text-lg font-bold'>
//               {profile?.username}
//             </Text>

//             <TextInput
//               value={text}
//               onChangeText={setText}
//               placeholder='What is on your mind?'
//               placeholderTextColor='gray'
//               className='text-white text-lg'
//               multiline
//               numberOfLines={4}
//               editable={!isPending}
//             />

//             {/* Multiple Images Preview */}
//             {images.length > 0 && (
//               <ScrollView 
//                 horizontal 
//                 showsHorizontalScrollIndicator={false}
//                 className='mt-4'
//               >
//                 <View className='flex-row gap-2'>
//                   {images.map((image, index) => (
//                     <View key={index} className='relative'>
//                       <Image
//                         source={{ uri: image.uri }}
//                         className='w-20 h-20 rounded-lg'
//                         style={{ aspectRatio: 1 }}
//                       />
//                       {/* Remove button */}
//                       <Pressable
//                         onPress={() => removeImage(index)}
//                         className='absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center'
//                         disabled={isPending}
//                       >
//                         <Ionicons name='close' size={12} color='white' />
//                       </Pressable>
//                     </View>
//                   ))}
//                 </View>
//               </ScrollView>
//             )}

//             {/* Upload progress */}
//             {uploadProgress && (
//               <Text className='text-blue-400 text-sm mt-2'>{uploadProgress}</Text>
//             )}

//             {/* Error display */}
//             {error && (
//               <Text className='text-red-500 text-sm mt-2'>{error.message}</Text>
//             )}

//             <View className='flex-row items-center gap-2 mt-4'>
//               <Pressable 
//                 onPress={pickImages} 
//                 className='flex-row items-center'
//                 disabled={isPending}
//               >
//                 <Ionicons name='images' size={20} color='#d1d5db' />
//                 {images.length > 0 && (
//                   <Text className='text-gray-400 ml-2'>
//                     {images.length} selected
//                   </Text>
//                 )}
//               </Pressable>
//             </View>
//           </View>
//         </View>

//         <View className='mt-4'>
//           <Pressable
//             onPress={() => mutate()}
//             className={`${
//               !canPost || isPending ? 'bg-white/50' : 'bg-white'
//             } p-3 px-6 self-end rounded-full`}
//             disabled={!canPost || isPending}
//           >
//             <Text className='text-black font-bold'>
//               {isPending ? 'Posting...' : 'Post'}
//             </Text>
//           </Pressable>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }


///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
//Extremely fast processing verison 
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/providers/AuthProvider';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { createPost } from '@/services/posts';
import * as ImagePicker from 'expo-image-picker';
import SupabaseImage from '@/components/SupabaseImage';

export default function NewPostScreen() {
  const [text, setText] = useState('');
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);

  const { user, profile } = useAuth();
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async () => {
      let imagePaths: string[] = [];
      
      if (images.length > 0) {
        for (const image of images) {
          const path = await uploadImage(image);
          imagePaths.push(path);
        }
      }

      return createPost({
        content: text,
        user_id: user!.id,
        images: imagePaths.length > 0 ? imagePaths : undefined,
      });
    },
    onSuccess: () => {
      setText('');
      setImages([]);
      router.back();
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      Alert.alert('Error', error.message || 'Failed to create post');
    },
  });

  const pickImages = async () => {
    // Basic image picker straight from Expo docs
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      // selectionLimit: 5,
      quality: 0.5,
    });

    if (!result.canceled) {
      setImages(result.assets);
    }
  };

  const uploadImage = async (image: ImagePicker.ImagePickerAsset) => {
    const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer());
    const fileExt = image.uri?.split('.').pop()?.toLowerCase() ?? 'jpeg';
    const path = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

    const { data, error: uploadError } = await supabase.storage
      .from('media')
      .upload(path, arraybuffer, {
        contentType: image.mimeType ?? 'image/jpeg',
      });
    
    if (uploadError) {
      throw uploadError;
    }

    return data.path;
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView edges={['bottom']} className='p-4 flex-1'>
      <KeyboardAvoidingView
        className='flex-1'
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 140 : 0}
      >
        <View className='flex-row gap-4'>
          <SupabaseImage
            bucket='avatars'
            path={profile?.avatar_url}
            className='w-12 h-12 rounded-full'
            transform={{ width: 50, height: 50 }}
          />

          <View className='flex-1'>
            <Text className='text-white text-lg font-bold'>
              {profile?.username}
            </Text>

            <TextInput
              value={text}
              onChangeText={setText}
              placeholder='What is on your mind?'
              placeholderTextColor='gray'
              className='text-white text-lg'
              multiline
              numberOfLines={4}
            />

            {/* Multiple Images Preview */}
            {images.length > 0 && (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                className='mt-4'
              >
                <View className='flex-row gap-2'>
                  {images.map((image, index) => (
                    <View key={index} className='relative'>
                      <Image
                        source={{ uri: image.uri }}
                        className='w-20 h-20 rounded-lg'
                        style={{ aspectRatio: 1 }}
                      />
                      <Pressable
                        onPress={() => removeImage(index)}
                        className='absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center'
                      >
                        <Ionicons name='close' size={12} color='white' />
                      </Pressable>
                    </View>
                  ))}
                </View>
              </ScrollView>
            )}

            {error && (
              <Text className='text-red-500 text-sm mt-4'>{error.message}</Text>
            )}

            <View className='flex-row items-center gap-2 mt-4'>
              <Ionicons
                onPress={pickImages}
                name='images'
                size={24}
                color='gray'
              />
              {images.length > 0 && (
                <Text className='text-gray-400'>
                  {images.length} selected
                </Text>
              )}
            </View>
          </View>
        </View>

        <View className='mt-auto'>
          <Pressable
            onPress={() => mutate()}
            className={`${
              isPending ? 'bg-white/50' : 'bg-white'
            } p-3 px-6 self-end rounded-full`}
            disabled={isPending}
          >
            <Text className='text-black font-bold'>
              {isPending ? 'Posting...' : 'Post'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

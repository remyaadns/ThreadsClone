// import { supabase } from '@/lib/supabase';
// import { useQuery } from '@tanstack/react-query';
// import { ActivityIndicator, Image, Text, View } from 'react-native';

// const downloadImage = async (
//   bucket: string,
//   path: string,
//   transform: { width: number; height: number } | undefined
// ): Promise<string> => {
//   return new Promise(async (resolve, reject) => {
//     const { data, error } = await supabase.storage
//       .from(bucket)
//       .download(path, { transform });
//     if (error) {
//       return reject(error);
//     }
//     const fr = new FileReader();
//     fr.readAsDataURL(data);
//     fr.onload = () => {
//       resolve(fr.result as string);
//     };
//   });
// };

// export default function SupabaseImage({
//   bucket,
//   path,
//   className,
//   transform,
// }: {
//   bucket: string;
//   path: string;
//   className: string;
//   transform: { width: number; height: number } | undefined;
// }) {
//   const { data, isLoading, error } = useQuery({
//     queryKey: ['supabaseImage', { bucket, path, transform }],
//     queryFn: () => downloadImage(bucket, path, transform),
//     staleTime: 1000 * 60 * 60 * 24,
//   });

//   // if (error) return <Text className='text-white'>Error: {error.message}</Text>;

//   return (
//     <Image
//       source={{
//         uri: data || undefined,
//       }}
//       className={`${className} bg-neutral-900`}
//     />
//   );
// }


//// this works kinda, in porfile edit, but not in post details
// import { supabase } from '@/lib/supabase';
// import { ActivityIndicator, Image, Text, View } from 'react-native';

// export default function SupabaseImage({
//   bucket,
//   path,
//   className,
//   transform,
// }: {
//   bucket: string;
//   path: string | null | undefined;
//   className: string;
//   transform?: { width: number; height: number };
// }) {
//   // Handle null/undefined paths
//   if (!path) {
//     return (
//       <View className={`${className} bg-neutral-700 items-center justify-center`}>
//         <Text className="text-neutral-400 text-xs">No Image</Text>
//       </View>
//     );
//   }

//   // Clean the path - remove leading slash if it exists
//   const cleanPath = path.startsWith('/') ? path.slice(1) : path;

//   // Get the public URL directly (much simpler than downloading)
//   const { data: publicUrl } = supabase.storage
//     .from(bucket)
//     .getPublicUrl(cleanPath, transform ? { transform } : undefined);

//   return (
//     <Image
//       source={{ uri: publicUrl.publicUrl }}
//       className={`${className} bg-neutral-900`}
//       onError={() => console.warn('Failed to load image:', publicUrl.publicUrl)}
//     />
//   );
// }



// import { supabase } from '@/lib/supabase';
// import { Image, Text, View } from 'react-native';

// export default function SupabaseImage({
//   bucket,
//   path,
//   className,
//   transform,
// }: {
//   bucket: string;
//   path: string | null | undefined;
//   className: string;
//   transform?: { width: number; height: number };
// }) {
//   // Handle null/undefined paths
//   if (!path) {
//     return (
//       <View className={`${className} bg-neutral-700 items-center justify-center`}>
//         <Text className="text-neutral-400 text-xs">No Image</Text>
//       </View>
//     );
//   }

//   // Clean the path - remove leading slash if it exists
//   const cleanPath = path.startsWith('/') ? path.slice(1) : path;

//   // For public buckets, construct the direct URL
//   const supabaseUrl = supabase.supabaseUrl;
//   const imageUrl = transform 
//     ? `${supabaseUrl}/storage/v1/render/image/public/${bucket}/${cleanPath}?width=${transform.width}&height=${transform.height}`
//     : `${supabaseUrl}/storage/v1/object/public/${bucket}/${cleanPath}`;

//   return (
//     <Image
//       source={{ uri: imageUrl }}
//       className={`${className} bg-neutral-900`}
//       onError={(e) => {
//         console.warn('Failed to load image:', imageUrl);
//         console.warn('Error details:', e.nativeEvent.error);
//       }}
//     />
//   );
// }


// /// This works 
// import { supabase } from '@/lib/supabase';
// import { Image, Text, View } from 'react-native';

// export default function SupabaseImage({
//   bucket,
//   path,
//   className,
//   transform,
// }: {
//   bucket: string;
//   path: string | null | undefined;
//   className: string;
//   transform?: { width: number; height: number };
// }) {
//   // Handle null/undefined paths
//   if (!path) {
//     return (
//       <View className={`${className} bg-neutral-700 items-center justify-center`}>
//         <Text className="text-neutral-400 text-xs">No Image</Text>
//       </View>
//     );
//   }

//   // Clean the path - remove leading slash if it exists
//   const cleanPath = path.startsWith('/') ? path.slice(1) : path;

//   // Use direct object URL (not transform endpoint)
//   const { data: publicUrl } = supabase.storage
//     .from(bucket)
//     .getPublicUrl(cleanPath);

//   return (
//     <Image
//       source={{ uri: publicUrl.publicUrl }}
//       className={`${className} bg-neutral-900`}
//       style={transform ? { 
//         width: transform.width, 
//         height: transform.height 
//       } : undefined}
//       resizeMode="cover"
//       onLoad={() => console.log('✅ Image loaded:', publicUrl.publicUrl)}
//       // onError={(e) => {
//       //   console.warn('❌ Failed to load image:', publicUrl.publicUrl);
//       //   console.warn('Error details:', e.nativeEvent.error);
//       // }}
//     />
//   );
// }


import { supabase } from '@/lib/supabase';
import { Image, Text, View } from 'react-native';

export default function SupabaseImage({
  bucket,
  path,
  className,
}: {
  bucket: string;
  path: string | null | undefined;
  className: string;
}) {
  // Handle null/undefined paths
  if (!path) {
    return (
      <View className={`${className} bg-neutral-700 items-center justify-center`}>
        <Text className="text-neutral-400 text-xs">No Image</Text>
      </View>
    );
  }

  // Clean the path - remove leading slash if it exists
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Use direct object URL (not transform endpoint)
  const { data: publicUrl } = supabase.storage
    .from(bucket)
    .getPublicUrl(cleanPath);

  return (
    <Image
      source={{ uri: publicUrl.publicUrl }}
      className={`${className} bg-neutral-900`}
      // resizeMode="cover"
      // onLoad={() => console.log('✅ Image loaded:', publicUrl.publicUrl)}
      // onError={(e) => {
      //   console.warn('❌ Failed to load image:', publicUrl.publicUrl);
      //   console.warn('Error details:', e.nativeEvent.error);
      // }}
    />
  );
}
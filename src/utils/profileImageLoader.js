import profileImgAsset from '../assets/profile.webp';

let loadedImage = null;

const loadPromise = new Promise((resolve) => {
  const img = new Image();
  img.src = profileImgAsset;
  if (img.complete && img.naturalWidth !== 0) {
    loadedImage = img;
    resolve(img);
  } else {
    img.onload = () => {
      loadedImage = img;
      resolve(img);
    };
    img.onerror = (err) => {
      console.error('Failed to load profile image asset:', profileImgAsset, err);
      resolve(null);
    };
  }
});

export function getProfileImageSync() {
  return loadedImage;
}

export function preloadProfileImage() {
  return loadPromise;
}

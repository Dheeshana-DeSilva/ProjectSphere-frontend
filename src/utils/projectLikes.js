export function getLikeId(like) {
  if (!like) return '';
  return String(like._id || like);
}

export function getUserId(user) {
  if (!user) return '';
  return String(user._id || user.id || '');
}

export function isLikedByUser(likes, user, likedByCurrentUser) {
  if (typeof likedByCurrentUser === 'boolean') {
    return likedByCurrentUser;
  }

  const userId = getUserId(user);
  if (!userId || !Array.isArray(likes) || likes.length === 0) {
    return false;
  }

  return likes.some((like) => getLikeId(like) === userId);
}

export function getLikesCount(likes) {
  if (Array.isArray(likes)) return likes.length;
  if (typeof likes === 'number') return likes;
  return 0;
}

export function normalizeProjectLikes(project = {}) {
  const likesArray = Array.isArray(project.likes) ? project.likes : [];
  return {
    likesArray,
    likes: getLikesCount(project.likes),
    likedByCurrentUser: Boolean(project.likedByCurrentUser),
  };
}

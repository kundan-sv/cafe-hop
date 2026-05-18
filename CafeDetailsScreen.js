import React, { useEffect, useState } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import CafeDetailsTabs from './CafeDetailsTab';
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, doc } from 'firebase/firestore';
import { firebaseApp } from './firebase';
import { globalStyles, colors } from './globalStyles';

const screenHeight = Dimensions.get('window').height;
const db = getFirestore(firebaseApp);

const foodKeywords = ['matcha', 'sandwich', 'tiramisu', 'coffee', 'latte', 'cake', 'tea'];

function extractMenuKeywords(reviews) {
  const counts = {};

  reviews.forEach(({ text }) => {
    if (!text) return;

    const comment = text.toLowerCase();

    foodKeywords.forEach((keyword) => {
      if (comment.includes(keyword)) {
        counts[keyword] = (counts[keyword] || 0) + 1;
      }
    });
  });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word);
}

export default function CafeDetailsScreen({ route, currentUser }) {
  const { cafe } = route.params;

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [friendIds, setFriendIds] = useState([]);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const userDocRef = doc(db, 'users', currentUser.uid);

    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFriendIds(data.friends || []);
      } else {
        setFriendIds([]);
      }
    });

    return unsubscribe;
  }, [currentUser?.uid]);

  useEffect(() => {
    const q = query(
      collection(db, 'cafes', cafe.place_id, 'reviews'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const revs = [];

      querySnapshot.forEach((doc) => {
        revs.push({ id: doc.id, ...doc.data() });
      });

      setReviews(revs);
      setLoadingReviews(false);
    });

    return unsubscribe;
  }, [cafe.place_id]);

  const handleReviewSubmit = async (review) => {
    try {
      await addDoc(collection(db, 'cafes', cafe.place_id, 'reviews'), {
        ...review,
        createdAt: new Date(),
        username: currentUser?.name || currentUser?.email || 'Anonymous',
        userId: currentUser?.uid,
      });
    } catch (e) {
      alert('Failed to submit review: ' + e.message);
    }
  };

  const yourAvgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : null;

  const friendAndMyReviews = reviews;

  const menuKeywords = extractMenuKeywords(reviews);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View
        style={{
          flex: 1,
          margin: 0,
          padding: 0,
          backgroundColor: colors.rosyPink,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 15,
            height: screenHeight * 0.3,
            padding: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={globalStyles.title}>{cafe.name}</Text>
            <Text style={globalStyles.address}>
              {cafe.vicinity || cafe.formatted_address || 'Address not available'}
            </Text>
          </View>

          <Image
            source={require('./assets/cafe_placeholder.png')}
            style={[
              globalStyles.cafeImage,
              {
                width: 150,
                height: 150,
                marginLeft: 15,
                borderRadius: 10,
              },
            ]}
            resizeMode="cover"
          />
        </View>

        <CafeDetailsTabs
          reviews={reviews}
          loadingReviews={loadingReviews}
          friendAndMyReviews={friendAndMyReviews}
          loadingGoogleReviews={false}
          menuKeywords={menuKeywords}
          cafe={cafe}
          handleReviewSubmit={handleReviewSubmit}
          googleAvgRating={yourAvgRating}
          googleTotalRatings={reviews.length}
          yourAvgRating={yourAvgRating}
        />
      </View>
    </View>
  );
}
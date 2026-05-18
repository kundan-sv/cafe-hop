import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';

import ReviewForm from './ReviewForm';
import StarRating from './StarRating';
import { globalStyles, colors } from './globalStyles';

const screenHeight = Dimensions.get('window').height;

export default function CafeDetailsTabs({
  reviews,
  loadingReviews,
  friendAndMyReviews,
  loadingGoogleReviews,
  menuKeywords,
  cafe,
  handleReviewSubmit,
  googleAvgRating,
  googleTotalRatings,
  yourAvgRating,
}) {
  const [selectedTab, setSelectedTab] = useState('community');

  const tabIcons = {
    community: require('./assets/reviews.png'),
    friends: require('./assets/reviews.png'),
    menu: require('./assets/menu.png'),
    form: require('./assets/write_review.png'),
  };

  const foodImages = {
    matcha: require('./assets/matcha.png'),
    sandwich: require('./assets/sandwich.png'),
    tiramisu: require('./assets/tiramisu.png'),
  };

  const renderReviewCard = (item, isFriend = false) => (
    <View
      key={isFriend ? `friend-${item.id}` : item.id}
      style={{
        backgroundColor: isFriend ? '#E8F5E9' : colors.rosyPink,
        padding: 12,
        marginBottom: 12,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <Text style={globalStyles.reviewUsername}>{item.username}</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
        <StarRating rating={Math.round(item.rating || 0)} />

        <Text style={[globalStyles.reviewRating, { marginLeft: 6 }]}>
          {(item.rating || 0).toFixed(1)}
        </Text>
      </View>

      <Text style={globalStyles.subtitle}>{item.comment}</Text>

      <Text style={globalStyles.reviewDate}>
        {item.createdAt?.toDate?.().toLocaleString() || item.createdAt}
      </Text>
    </View>
  );

  const renderTabs = () => (
    <View style={{ flexDirection: 'row', margin: 10 }}>
      {['community', 'friends', 'menu', 'form'].map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => setSelectedTab(tab)}
          style={{
            flex: 1,
            paddingVertical: 8,
            backgroundColor: selectedTab === tab ? colors.earthyGreen : '#fff',
            borderColor: selectedTab === tab ? '#fff' : colors.earthyGreen,
            borderWidth: 2,
            borderRadius: 15,
            marginHorizontal: 3,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={tabIcons[tab]}
            style={{ width: 24, height: 24, marginBottom: 4 }}
            resizeMode="contain"
          />

          <Text
            style={{
              textAlign: 'center',
              color: selectedTab === tab ? '#fff' : '#333',
              fontWeight: '800',
              fontFamily: 'Pixelify',
              fontSize: 12,
            }}
          >
            {tab === 'community'
              ? 'Community'
              : tab === 'friends'
              ? 'Friends'
              : tab === 'menu'
              ? 'Menu'
              : 'Write'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'community':
        return (
          <View style={{ flex: 1, padding: 15 }}>
            <Text style={styles.sectionTitle}>Community Reviews</Text>

            {yourAvgRating && (
              <View style={styles.inlineRow}>
                <Text style={globalStyles.ratingText}>
                  App Rating: {yourAvgRating}
                </Text>
                <StarRating rating={Math.round(yourAvgRating)} />
                <Text style={globalStyles.ratingText}>({reviews.length})</Text>
              </View>
            )}

            {loadingReviews ? (
              <ActivityIndicator size="small" />
            ) : reviews.length === 0 ? (
              <Text style={globalStyles.text}>No community reviews yet.</Text>
            ) : (
              <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                {reviews.map((item) => renderReviewCard(item))}
              </ScrollView>
            )}
          </View>
        );

      case 'friends':
        return (
          <View style={{ flex: 1, padding: 15 }}>
            <Text style={styles.sectionTitle}>Friend Reviews</Text>

            {loadingReviews ? (
              <ActivityIndicator size="small" />
            ) : friendAndMyReviews.length === 0 ? (
              <Text style={globalStyles.text}>No friend reviews yet.</Text>
            ) : (
              <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                {friendAndMyReviews.map((item) => renderReviewCard(item, true))}
              </ScrollView>
            )}
          </View>
        );

      case 'menu':
        return (
          <View style={{ padding: 10 }}>
            <Text style={styles.sectionTitle}>Popular Menu</Text>

            {loadingGoogleReviews ? (
              <ActivityIndicator size="small" />
            ) : menuKeywords.length === 0 ? (
              <Text style={globalStyles.text}>No popular items mentioned yet.</Text>
            ) : (
              <View>
                {menuKeywords.map((word) => (
                  <View
                    key={word}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: colors.rosyPink,
                      borderRadius: 15,
                      padding: 10,
                      marginBottom: 10,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                      elevation: 2,
                    }}
                  >
                    {foodImages[word.toLowerCase()] && (
                      <Image
                        source={foodImages[word.toLowerCase()]}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 10,
                          marginRight: 15,
                        }}
                        resizeMode="cover"
                      />
                    )}

                    <Text
                      style={{
                        fontFamily: 'Pixelify',
                        fontSize: 16,
                        color: '#333',
                      }}
                    >
                      {word.charAt(0).toUpperCase() + word.slice(1)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );

      case 'form':
        return (
          <View style={{ padding: 10 }}>
            <Text style={styles.sectionTitle}>Write a Review</Text>
            <ReviewForm cafeId={cafe.place_id} onSubmit={handleReviewSubmit} />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View
      style={{
        backgroundColor: '#fff',
        padding: 0,
        margin: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: screenHeight * 0.59,
      }}
    >
      {renderTabs()}
      {renderTabContent()}
    </View>
  );
}

const styles = {
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 10,
    gap: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Pixelify',
    color: colors.earthyGreen,
    marginBottom: 10,
  },
};
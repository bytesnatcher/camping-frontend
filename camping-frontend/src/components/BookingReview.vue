<template>
  <div class="review-container max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Leave a Review</h2>
    <form @submit.prevent="submitReview">
      <div class="form-group mb-4">
        <label for="reviewText" class="block text-lg font-medium text-gray-700 mb-2">Review:</label>
        <textarea id="reviewText" v-model="reviewText" rows="4" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" required></textarea>
      </div>
      <div class="form-group mb-6">
        <label for="starRating" class="block text-lg font-medium text-gray-700 mb-2">Rating:</label>
        <div class="flex space-x-2">
          <span v-for="star in 5" :key="star" @click="setRating(star)" :class="{ 'filled': star <= rating }" class="cursor-pointer text-3xl">&#9733;</span>
        </div>
      </div>
      <button type="submit" class="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition-colors duration-300">Submit Review</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "BookingReview",
  data() {
    return {
      reviewText: "",
      rating: 0,
      bookingId: null
    };
  },
  mounted() {
    this.bookingId = this.$route.params.id; // Get booking ID from URL
  },
  methods: {
    setRating(star) {
      this.rating = star;
    },
    async submitReview() {
      try {
        const reviewData = {
          bookingId: this.bookingId,
          text: this.reviewText,
          rating: this.rating
        };

        const response = await fetch("https://localhost:7084/Review/AddReview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(reviewData)
        });

        if (response.ok) {
          console.log("Review submitted successfully!");
          alert("Review submitted successfully!");
        } else {
          console.error("Failed to submit review:", response.statusText);
        }
      } catch (error) {
        console.error("Error submitting review:", error.message);
      }
    }
  }
};
</script>

<style scoped>
.review-container {
  background-color: #f9f9f9;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.filled {
  color: gold;
}

.form-group label {
  font-size: 1.125rem; /* 18px */
}

textarea {
  resize: vertical;
  transition: border-color 0.3s;
}

textarea:focus {
  border-color: #2d3748; /* Darker shade for focus */
}

button {
  background-color: #2f855a; /* Dark green */
  transition: background-color 0.3s ease-in-out;
}

button:hover {
  background-color: #276749; /* Darker green on hover */
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.5); /* Green shadow for focus */
}

.flex span {
  transition: transform 0.2s;
}

.flex span:hover {
  transform: scale(1.2);
}

.flex span:active {
  transform: scale(1.1);
}

.flex span.filled {
  color: #f6ad55; /* Nice orange color for filled stars */
}
</style>

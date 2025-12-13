import { createContext, useContext, useState } from "react";

export type Reply = {
  text: string;
  date: string;
};

export type Review = {
  rating: number;
  comment: string;
  date: string;
  replies: Reply[];
};

type ReviewMap = Record<number, Review[]>;

type ReviewContextType = {
  reviews: ReviewMap;
  addReview: (productId: number, review: { rating: number; comment: string }) => void;
  addReply: (productId: number, reviewIndex: number, reply: string) => void;
};

const ReviewContext = createContext<ReviewContextType | null>(null);

export const ReviewProvider = ({ children }: { children: React.ReactNode }) => {
  const [reviews, setReviews] = useState<ReviewMap>({});

  // ✅ ADD REVIEW (already safe)
  const addReview = (
    productId: number,
    review: { rating: number; comment: string }
  ) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: [
        ...(prev[productId] || []),
        {
          rating: review.rating,
          comment: review.comment,
          date: new Date().toLocaleString(),
          replies: [],
        },
      ],
    }));
  };

  // ✅ ✅ FIXED: ADD REPLY (IMMUTABLE)
  const addReply = (productId: number, reviewIndex: number, reply: string) => {
    setReviews((prev) => {
      const productReviews = prev[productId] || [];

      const updatedReviews = productReviews.map((r, i) =>
        i === reviewIndex
          ? {
              ...r,
              replies: [
                ...r.replies,
                {
                  text: reply,
                  date: new Date().toLocaleString(),
                },
              ],
            }
          : r
      );

      return {
        ...prev,
        [productId]: updatedReviews,
      };
    });
  };

  return (
    <ReviewContext.Provider value={{ reviews, addReview, addReply }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => {
  const ctx = useContext(ReviewContext);
  if (!ctx) throw new Error("useReviews must be used inside ReviewProvider");
  return ctx;
};

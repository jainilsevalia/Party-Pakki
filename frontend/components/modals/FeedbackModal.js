import React, { useState, useEffect } from "react";

import ReactStarsRating from "react-awesome-stars-rating";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Popup from "reactjs-popup";

import { addReview } from "../../actions/auth";
import { setFeedbackModal } from "../../actions/other";

const FeedbackModal = () => {
  const { isOpen, venueId } = useSelector((state) => state.other.feedbackModal);
  const user = useSelector((state) => state.auth.user);
  const reviews = user?.reviews;

  const dispatch = useDispatch();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const submitReview = async () => {
    const data = { rating, comment, venueId };
    const res = await dispatch(addReview(data));
    if (res.status == 200) {
      toast.success(res.success);
      dispatch(
        setFeedbackModal({
          isOpen: false,
        })
      );
    } else {
      toast.error(res.error);
    }
  };

  useEffect(() => {
    if (reviews?.length) {
      const review = reviews.find((r) => r.venue.uuid == venueId);
      if (review) {
        setRating(review.rating);
        setComment(review.comment);
      }
    }
  }, [reviews, venueId]);

  return (
    <Popup
      open={isOpen}
      onClose={() =>
        dispatch(
          setFeedbackModal({
            isOpen: false,
          })
        )
      }
      closeOnDocumentClick
    >
      <div className="modal-open modal">
        <div className="modal-box relative">
          <h3 className="mb-4 text-center text-lg font-bold">Give feedback</h3>
          <hr />
          <div className="mt-5">
            <ReactStarsRating
              onChange={(rating) => setRating(rating)}
              value={rating}
              className="flex justify-around"
              size={30}
              starGap={5}
              secondaryColor="#d3d3d3"
            />
            <textarea
              className="textarea textarea-bordered mt-5 w-full"
              placeholder="Write your experience with this venue"
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            ></textarea>

            <div className="float-right mt-5">
              <button className="btn btn-primary" onClick={submitReview}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default FeedbackModal;

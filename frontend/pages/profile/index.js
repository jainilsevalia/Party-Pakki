import React, { useState, useEffect, useMemo } from "react";

import { NextSeo } from "next-seo";
import Image from "next/image";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { VscEdit } from "react-icons/vsc";
import DatePicker from "react-modern-calendar-datepicker";
import { useDispatch, useSelector } from "react-redux";
import MediaQuery from "react-responsive";
import Select from "react-select";

import { updateUser, hasToken } from "../../actions/auth";
import { loadStatesCities, setPhoneModal } from "../../actions/other";
import Error from "../../components/FormError";
import EditProfileAction from "../../components/mobile-footer-actions/EditProfileAction";
import QueryAndBooking from "../../components/QueryAndBooking";
import { path } from "../../config";

const Profile = () => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [preview, setPreview] = useState();
  const [deletePhoto, setDeletePhoto] = useState();

  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const router = useRouter();

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    control,
  } = useForm();

  const onSubmit = async (obj) => {
    obj.date_of_birth = selectedDay
      ? `${selectedDay.day}/${selectedDay.month}/${selectedDay.year}`
      : null;

    const data = new FormData();

    data.append("first_name", obj.first_name);
    data.append("last_name", obj.last_name);
    data.append("user", user.user);

    if (obj.date_of_birth) data.append("date_of_birth", obj.date_of_birth);
    if (obj.state) data.append("state", obj.state);
    if (obj.city) data.append("city", obj.city);

    if (typeof obj.photo === "object") {
      data.append("photo", obj.photo[0]);
    }

    if (deletePhoto) {
      data.append("delete_photo", true);
    }

    const res = await dispatch(updateUser(data));
    if (res.success) {
      toast.success(res.success);
      setShowEditProfile(false);
    } else {
      toast.error(res.error);
    }
  };

  useEffect(() => {
    if (!hasToken() && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (
      isAuthenticated &&
      showEditProfile &&
      user &&
      Object.keys(user).length
    ) {
      const { date_of_birth, first_name, last_name, photo, state, city } = user;
      reset({
        first_name,
        last_name,
        date_of_birth,
        photo,
        state,
        city,
      });
      if (date_of_birth) {
        const date = date_of_birth.split("/");
        setSelectedDay({
          day: parseInt(date[0]),
          month: parseInt(date[1]),
          year: parseInt(date[2]),
        });
      }
      setPreview(null);
      setDeletePhoto();
    }
  }, [showEditProfile, isAuthenticated, reset]);

  useEffect(() => {
    dispatch(loadStatesCities());
  }, [dispatch]);

  const locations = useSelector((state) => state.other.locations);

  const stateOptions = useMemo(() => {
    return Object.keys(locations).map((state) => ({
      value: state,
      label: state,
    }));
  }, [locations]);

  const selectedState = watch("state");

  const cityOptions = useMemo(() => {
    const cities = locations[selectedState];
    if (cities) {
      return cities.map((city) => ({
        value: city,
        label: city,
      }));
    } else {
      const cities = Object.values(locations).flat();
      return cities.map((city) => ({
        value: city,
        label: city,
      }));
    }
  }, [locations, selectedState]);

  const file = watch("photo");

  useEffect(() => {
    let url;
    if (file && typeof file === "object" && Object.keys(file).length) {
      url = URL.createObjectURL(file[0]);
      setPreview(url);
    }
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const DateInput = ({ ref }) => (
    <input
      ref={ref}
      type="text"
      className="input input-bordered w-full"
      value={
        selectedDay
          ? `${selectedDay.day}/${selectedDay.month}/${selectedDay.year}`
          : ""
      }
      readOnly
    />
  );

  const ControllerSelect = ({ label, options }) => {
    return (
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
        <Controller
          control={control}
          name={label.toLowerCase()}
          render={({ field: { onChange, value, ref } }) => (
            <Select
              ref={ref}
              options={options}
              value={options.find((op) => op.value === value)}
              onChange={(op) => onChange(op.value)}
              menuPlacement="top"
              styles={{
                menu: (provided) => ({
                  ...provided,
                  zIndex: 10,
                }),
              }}
            />
          )}
        />
      </div>
    );
  };

  const openPhoneModal = () => {
    dispatch(
      setPhoneModal({
        isOpen: true,
        title: "Add or change phone number",
        openFrom: "profile",
      })
    );
  };

  return (
    <>
      <NextSeo title="Profile & Bookings • Partypakki" />
      <div
        className="h-20 bg-neutral-content sm:h-32"
        style={{
          backgroundImage: "url('/assets/images/confetti.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <div className="custom-container px-5 sm:px-10">
        <div className="flex flex-wrap items-start justify-between ">
          <div className="flex items-start gap-4">
            <div className="avatar mt-[-20px] sm:mt-[-50px] ">
              <div className="w-20 sm:w-36">
                <Image
                  src={
                    user?.photo ? path(user.photo) : "/assets/images/avatar.png"
                  }
                  layout="fill"
                  alt="user avatar"
                  className="rounded-full"
                />
              </div>
            </div>
            <div>
              <strong className="text-xl sm:text-3xl">
                {user?.first_name} {user?.last_name}
              </strong>
              <div className="mt-1 text-xs sm:ml-1 sm:text-sm">
                {user?.email}
              </div>
            </div>
          </div>
          <div>
            {showEditProfile ? (
              <div className="mt-2  hidden gap-2 sm:flex">
                <button
                  className="btn btn-outline"
                  onClick={() => setShowEditProfile(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSubmit(onSubmit)}
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                className="btn btn-ghost mt-2 gap-2"
                onClick={() => setShowEditProfile(true)}
              >
                <VscEdit size={18} />
                <div className="hidden sm:block">Edit profile</div>
              </button>
            )}
          </div>
        </div>
        {showEditProfile ? (
          <>
            {/* Edit profile  */}
            <div className="mx-auto mt-10 flex max-w-screen-sm flex-col items-center">
              <div className="flex w-full justify-center gap-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">First name</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    {...register("first_name", {
                      required: "First name is required",
                      minLength: {
                        value: 3,
                        message: "First name must be at least 3 characters",
                      },
                    })}
                  />
                  <Error message={errors.first_name?.message} />
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Last name</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    {...register("last_name", {
                      required: "Last name is required",
                      minLength: {
                        value: 3,
                        message: "Last name must be at least 3 characters",
                      },
                    })}
                  />
                </div>
              </div>
              <div className="mt-3 flex w-full justify-center gap-4">
                <div className="form-control w-full">
                  <label htmlFor="date-picker" className="label">
                    <span className="label-text">Date of birth</span>
                  </label>
                  {/* date picker  */}
                  <DatePicker
                    value={selectedDay}
                    onChange={setSelectedDay}
                    shouldHighlightWeekends
                    renderInput={DateInput}
                    wrapperClassName="dob w-full max-w-xs"
                    calendarPopperPosition="bottom"
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Phone number</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    readOnly
                    value={user?.phone_number}
                    placeholder="Not available"
                  />
                  <label className="label">
                    <span className="label-text-alt">
                      To <strong>add or change</strong> the phone number{" "}
                      <span
                        className="cursor-pointer text-sky-500 underline"
                        onClick={openPhoneModal}
                      >
                        click here
                      </span>
                      .
                    </span>
                  </label>
                </div>
              </div>
              <hr className="my-7 w-full" />
              <div className="flex w-full items-center gap-4 self-start">
                <div className="avatar">
                  <div className="w-24 rounded-full">
                    <Image
                      src={
                        preview
                          ? preview
                          : user?.photo && !deletePhoto
                          ? path(user.photo)
                          : "/assets/images/avatar.png"
                      }
                      layout="fill"
                      alt="user avatar"
                      className="rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <input
                    id="profile-pic"
                    accept="image/*"
                    type="file"
                    hidden
                    {...register("photo")}
                  />
                  <label
                    htmlFor="profile-pic"
                    className="btn btn-primary btn-sm"
                  >
                    {user?.photo ? "Update" : "Upload"}
                  </label>
                  {user?.photo && !deletePhoto && (
                    <button
                      className="btn btn-sm ml-2"
                      onClick={() => {
                        setPreview(null);
                        setDeletePhoto(true);
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              <hr className="my-7 w-full" />
              <div className="flex w-full justify-center gap-4">
                <ControllerSelect label={"State"} options={stateOptions} />
                <ControllerSelect label={"City"} options={cityOptions} />
              </div>
            </div>
            <div className="mb-10"></div>
          </>
        ) : (
          <QueryAndBooking />
        )}
      </div>
      <div className="h-40 sm:h-0"></div>
      {/* footer edit profile btns  */}
      <MediaQuery maxWidth={640}>
        {showEditProfile && (
          <EditProfileAction
            setShowEditProfile={setShowEditProfile}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
          />
        )}
      </MediaQuery>
    </>
  );
};

export default Profile;

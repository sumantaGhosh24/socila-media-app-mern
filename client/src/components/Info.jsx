import {useState} from "react";

import {Avatar, EditProfile, FollowBtn, Followers, Following} from "./";

const Info = ({auth, profile}) => {
  const [onEdit, setOnEdit] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  return (
    <div className="my-5 space-y-2">
      <div className="flex items-center gap-2">
        <Avatar image={profile.avatar} alt={profile.username} size="large" />
        <div>
          <h2 className="mb-1.5 text-xl font-bold capitalize">
            {profile.fullname}
          </h2>
          <h2 className="font-bold">@{profile.username}</h2>
        </div>
      </div>
      <h4>Email: {profile.email}</h4>
      <h4>Mobile: {profile.mobile}</h4>
      <h4>Address: {profile.address}</h4>
      <a
        href={profile.website}
        target="_blank"
        rel="noreferrer"
        className="hover:underline"
      >
        Website: {profile.website}
      </a>
      <p>Story: {profile.story}</p>
      <div>
        {profile._id === auth ? (
          <button
            onClick={() => {
              setOnEdit(true);
              setShowFollowers(false);
              setShowFollowing(false);
            }}
            className="focus:shadow-outline rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600 focus:outline-none"
          >
            Edit Profile
          </button>
        ) : (
          <FollowBtn user={profile} currentUser={auth} />
        )}
      </div>
      <div className="flex gap-3 items-center">
        <button
          onClick={() => {
            setShowFollowers(true);
            setShowFollowing(false);
            setOnEdit(false);
          }}
          className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:outline-none"
        >
          {profile?.followers?.length} Followers
        </button>
        <button
          onClick={() => {
            setShowFollowing(true);
            setShowFollowers(false);
            setOnEdit(false);
          }}
          className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:outline-none"
        >
          {profile?.following?.length} Following
        </button>
      </div>
      {onEdit && <EditProfile setOnEdit={setOnEdit} user={profile} />}
      {showFollowers && (
        <Followers
          users={profile.followers}
          setShowFollowers={setShowFollowers}
          currentUser={auth}
        />
      )}
      {showFollowing && (
        <Following
          users={profile.following}
          setShowFollowing={setShowFollowing}
          currentUser={auth}
        />
      )}
    </div>
  );
};

export default Info;

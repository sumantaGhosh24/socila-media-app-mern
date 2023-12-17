import {useState} from "react";
import propTypes from "prop-types";

import {Avatar, EditProfile, FollowBtn, Followers, Following} from "../";

const Info = ({auth, profile}) => {
  const [onEdit, setOnEdit] = useState(false);

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  return (
    <div>
      <div>
        <Avatar image={profile.avatar} alt={profile.username} size="large" />
        <div>
          <div>
            <h2>{profile.username}</h2>
            {profile._id === auth ? (
              <button onClick={() => setOnEdit(true)}>Edit Profile</button>
            ) : (
              <FollowBtn user={profile} currentUser={auth} />
            )}
          </div>
          <div>
            <span
              onClick={() => {
                setShowFollowers(true);
                setShowFollowing(false);
              }}
            >
              {profile?.followers?.length} Followers
            </span>
            <span
              onClick={() => {
                setShowFollowing(true);
                setShowFollowers(false);
              }}
            >
              {profile?.following?.length} Following
            </span>
          </div>
          <h6>
            {profile.fullname} <span>{profile.mobile}</span>
          </h6>
          <p>{profile.address}</p>
          <h6>{profile.email}</h6>
          <a href={profile.website} target="_blank" rel="noreferrer">
            {profile.website}
          </a>
          <p>{profile.story}</p>
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
    </div>
  );
};

Info.propTypes = {
  auth: propTypes.string,
  profile: propTypes.object,
};

export default Info;

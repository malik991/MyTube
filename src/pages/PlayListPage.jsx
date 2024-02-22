import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPlayLists } from "../store/playListSlice";
import { Container } from "../components";
import PlaylistCard from "../components/MaterialUI/PlaylistCard"; // Import the PlayListMedia component
import DividerText from "../components/MaterialUI/DividerWithText";
import CustomeIcons from "../components/MaterialUI/AddCircleIcon";
import FormDialog from "../components/MaterialUI/DialogForm";
const PlayListPage = () => {
  const dispatch = useDispatch();
  const playlists = useSelector((state) => state.playlist.userPlayLists);
  const { status, error } = useSelector((state) => state.playlist);
  const [formDialogOpen, setFormDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPlayLists());
  }, [dispatch]);

  const handleCreatePlaylist = () => {
    //console.log("hello");
    setFormDialogOpen(true);
  };

  return (
    <div className="flex flex-col items-center w-full py-8 mt-4 text-center">
      <Container>
        <div className="flex flex-wrap">
          {status === "loading" ? (
            <div className="p-2 w-full">
              <PlaylistCard loading={true} />
            </div>
          ) : status === "failed" ? (
            <div className="p-2 w-full">
              <p className="text-2xl font-bold hover:text-gray-500">{error}</p>
            </div>
          ) : (
            status === "succeeded" && (
              <>
                {playlists.docs.length > 0 ? (
                  <div className="p-2 w-full">
                    <PlaylistCard loading={false} />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-center">
                      <CustomeIcons onClick={() => handleCreatePlaylist()} />
                    </div>

                    <div className="p-2 w-full">
                      <h1 className="text-2xl font-bold hover:text-gray-500">
                        Please create a playlist
                      </h1>
                    </div>
                  </>
                )}
              </>
            )
          )}
        </div>
      </Container>
      <FormDialog
        open={formDialogOpen}
        handleClose={() => setFormDialogOpen(false)}
      />
    </div>
  );
};

export default PlayListPage;

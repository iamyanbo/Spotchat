import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal } from "react";
import { NavbarComponent } from "./Navbar"

interface album{
    collaborative: boolean;
    description: string;
    external_urls: object;
    href: string;
    id: string;
    images: object[];
    name: string;
    owner: object;
    primary_color: null;
    public: boolean;
    snapshot_id: string;
    tracks: object;
    type: string;
    uri: string;
}

const Home = () => {
    const user = JSON.parse(localStorage.getItem('user')!);
    console.log(user);
    return (
        <div>
            <NavbarComponent />
            <h1>Home</h1>
            <h6>Albums:</h6>
            {user.albums.items.map((album: album) => {
                return (
                    <div>
                        <h6>{album.name}</h6>
                    </div>
                );
            })}
        </div>
    );
}
export default Home;
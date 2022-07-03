import React from "react";
import { Button, Card } from "react-bootstrap";
import Home from "./Home";
import NavbarComponent  from "./Navbar";

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

class Album extends React.Component<{}, any>{
    constructor(props: any){
        super(props);
        this.state = {
            user : JSON.parse(localStorage.getItem("user")!),
        }
    }
    render(){
        console.log(this.state.user)
        return(
            <div className="row" style={{display:"flex", alignContent:"center", justifyContent:"center"}}>
                {this.state.user.albums.items.map((album: album) => {
                return (
                    <Card style={{width: "18rem", margin:"0.8rem", paddingLeft:"0px", paddingRight:"0px"}} key={album.id}>
                        <Card.Header style={{background:(album.public? "#98FB98": "#FAA0A0")}}>{album.public? "Public" : "Private"}</Card.Header>
                        <Card.Body>
                            <Card.Title>{album.name}</Card.Title>
                            <Card.Text dangerouslySetInnerHTML={{__html: album.description === ""? "No Description": album.description}}></Card.Text>
                        </Card.Body>
                        <Card.Footer style={{alignContent:"center", display:"flex", justifyContent:"center", background:"transparent", borderTop: "0px"}}>
                            <Button href={album.uri}>View on Spotify</Button>
                        </Card.Footer>
                    </Card>
                );
                })}
            </div>
        );
    }
}
export default Album;
        
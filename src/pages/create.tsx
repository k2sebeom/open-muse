import { NextPage } from "next";
import Header from "../components/Header";
import InputField from "../components/InputField";

import RoundButton from "../components/RoundButton";


const CreatePage: NextPage = () => {

    return (
        <div className="background">
            <Header />

            <div className="container">
                <h1>Room Title</h1>
                <InputField
                    placeholder="title"
                />

                <h1>Room Description</h1>
                <InputField
                    placeholder="title"
                />

                <h1>Room Capacity</h1>
                <InputField
                    placeholder="title"
                />

                <h1>Mode</h1>
                <div>
                    <RoundButton width={130} title="Open Mic" />
                    <span>  </span>
                    <RoundButton width={130} title="Show" />
                </div>

                <h1>{'Password (Optional)'}</h1>
                <InputField
                    placeholder="title"
                />

                <RoundButton
                    width={200}
                    title="Create"
                />
            </div>

            <style jsx>{`
                .background {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                h1 {
                    font-size: 26px;
                    width: 100%;
                    border-bottom: 1px solid black;
                }

                .container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 70%;
                }

                .controls {
                    position: fixed;
                    bottom: 20px;
                }

                .light {
                    background-color: #000;
                    width: 100vw;
                    height: 100vh;
                    position: absolute;
                    top: 0;
                    left: 0;
                    opacity: 0.2;
                }
            `}</style>
        </div>
    )
}


export default CreatePage;
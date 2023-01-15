import { NextPage } from "next"

const LandingPage: NextPage = () => {
  return (<>
    <div
        style={{
          position: "absolute",
          display: "flex",
          width: "100%",
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: "1em",
          top: 0,
          left: 0,
          padding: "0.5em 2em",
        }}
      >
        <button
          style={{
            border: "none",
            background: "var(--c-purple-light)",
            color: "var(--c-purple-dark)",
            padding: ".5em 1em",
            borderRadius: "0.5em",
            cursor: "pointer",
          }}
        >
        </button>
        <button
          style={{
            border: "none",
            background: "var(--c-purple-light)",
            color: "var(--c-purple-dark)",
            padding: ".5em 1em",
            borderRadius: "0.5em",
            cursor: "pointer",
          }}
        >
        </button>
        <button
          style={{
            border: "none",
            background: "var(--c-yellow-mid)",
            padding: ".5em 1em",
            borderRadius: "0.5em",
            cursor: "pointer",
          }}
        >
          try me
        </button>
      </div>
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--c-purple-dark)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "5em",
      }}
    >
      <div
        style={{
          display: "grid",
          placeContent: "center",
        }}
      >
        <h1
          style={{
            margin: "0",
            fontSize: "4em",
            color: "var(--c-yellow-mid)"
          }}
        >
          wattime
        </h1>
        <h1
          style={{
            margin: "0",
            fontSize: "4em",
            color: "var(--c-yellow-light)"
          }}
        >
          should we
        </h1>
        <h1
          style={{
            margin: "0",
            fontSize: "4em",
            color: "var(--c-yellow-light)"
          }}
        >
          run the dishwasher?
        </h1>
        <button
          style={{
            border: "none",
            background: "var(--c-yellow-mid)",
            padding: ".5em 1.5em",
            borderRadius: "0.5em",
            cursor: "pointer",
            marginTop: "1em",
            width: "max-content",
            fontSize: "1em",
          }}
        >
          find out
        </button>
      </div>
      <div
        style={{
          display: "grid",
          placeContent: "center",
        }}
      >
        {landingPageGraphic}
      </div>
    </div>
    <footer
        style={{
          position: "absolute",
          display: "flex",
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: "1em",
          bottom: 0,
          left: 0,
          padding: "0.5em 2em",
          color: "var(--c-yellow-dark)"
        }}
      >
        <p>github</p>
        <p>version 1.0.0</p>
      </footer>
  </>)
}

const landingPageGraphic = <svg xmlns="http://www.w3.org/2000/svg" width="514.865" height="378" viewBox="0 0 514.865 378">
<line y1="378" transform="translate(1)" fill="none" stroke="#47464d" strokeWidth="2" strokeDasharray="30 50"/>
<line y1="378" transform="translate(513.865)" fill="none" stroke="#47464d" strokeWidth="2" strokeDasharray="30 50"/>
<line y1="378" transform="translate(330.865)" fill="none" stroke="#47464d" strokeWidth="2" strokeDasharray="30 50"/>
<line y1="378" transform="translate(173.865)" fill="none" stroke="#47464d" strokeWidth="2" strokeDasharray="30 50"/>
<path d="M591.07,77.835l-172.053,59.12L259.011,62.823l-171.2,66.493,9.909-52.87L260.548,10.967l163.12,73.749L600.98,24.957Z" transform="translate(-87.115 111.533)" fill="#e8ca28"/>
</svg>


export default LandingPage
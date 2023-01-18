import { max } from "d3"
import { NextPage } from "next"
import Link from "next/link"
import { useEffect, useState } from "react"

const LandingPage: NextPage = () => {

  const [txtidx, set_txtidx] = useState(0)

  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    set_txtidx((txtidx+1)%3)
  }, [time])

  const things: Record<number, (string|number)[]> = {
    0: ["run", "the dishwasher", 90, 418],
    1: ["charge", "the car", 190, 194],
    2: ["save on", "the heating", 210, 315],
  }

  return (<>
    <nav
      style={{
        position: "absolute",
        display: "flex",
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: "1em",
        top: 0,
        left: 0,
        padding: "1.5em 2em",
      }}
    >
      <button
        style={{
          border: "none",
          background: "none",
          color: "var(--c-purple-light)",
          padding: "0 0.5em",
          borderRadius: "0.2em",
          cursor: "pointer",
          fontSize: "1em",
        }}
      >
        <Link href="/about">
          about
        </Link>
      </button>
      <button
        style={{
          border: "none",
          background: "none",
          color: "var(--c-purple-light)",
          padding: "0 0.5em",
          borderRadius: "0.2em",
          cursor: "pointer",
          fontSize: "1em",
        }}
      >
        <Link href="/sources">
          sources
        </Link>
      </button>
      <button
        style={{
          border: "none",
          background: "var(--c-purple-light)",
          color: "var(--c-purple-dark)",
          padding: "0 0.5em",
          borderRadius: "0.2em",
          cursor: "pointer",
          fontSize: "1em",
          fontFamily: "sofia-pro,sans-serif",
          fontWeight: 400,
          fontStyle: "normal",
        }}
      >
        <Link href="/">
          try me
        </Link>
      </button>
    </nav>
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--c-purple-dark)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        padding: "0 5em",
        gap: "5em",
      }}
    >
      <div
        style={{
          display: "grid",
          alignContent: "center",
          justifyContent: "left",
          // gridColumn: "1 / -1",
          // gridRow: "1 / 2",
        }}
      >
        <div
          style={{
            marginBottom: "0.5em",
          }}
        >
          {wattimeLogoText}
        </div>
        <h1
          style={{
            margin: "0",
            fontSize: "4em",
            color: "var(--c-yellow-light)",
            fontFamily: "franklin-gothic-urw,sans-serif",
            fontWeight: 400,
            fontStyle: "italic",
          }}
        >
          should we
        </h1>
        <h1
          style={{
            margin: "0",
            fontSize: "4em",
            color: "var(--c-yellow-light)",
            fontFamily: "franklin-gothic-urw,sans-serif",
            fontWeight: 400,
            fontStyle: "italic",
            transition: "0.3s ease-out",
          }}
        >
          <span
            style={{
              transition: "0.3s ease-out",
              display: "inline-block",
              width: `${things[txtidx][2]}px`,
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {things[txtidx][0]}
          </span>
          {" "}
          <span
            style={{
              transition: "0.3s ease-out",
              display: "inline-block",
              width: `${things[txtidx][3]}px`,
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {things[txtidx][1]}
          </span>
          <span
            style={{
              transition: "0.3s ease-out",
              display: "inline-block",
              overflow: "hidden",
            }}
          >
            ?
          </span>
        </h1>
        <button
          style={{
            border: "none",
            background: "var(--c-yellow-mid)",
            padding: "0.2em 1.5em",
            borderRadius: "0.5em",
            cursor: "pointer",
            marginTop: "0.5em",
            width: "max-content",
            fontSize: "1.5em",
            fontFamily: "sofia-pro,sans-serif",
            fontWeight: 400,
            fontStyle: "normal",
          }}
        >
          <Link href="/">
            find out
          </Link>
        </button>
      </div>
      <div
        style={{
          display: "grid",
          placeItems: "center",
          width: "100%",
          // gridColumn: "1 / -1",
          // gridRow: "1 / 2",
          // opacity: 0.1,
        }}
      >
        {landingPageGraphic}
      </div>
    </main>
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
          padding: "1.5em 2em",
          color: "var(--c-yellow-dark)"
        }}
      >
        <p>
          github
        </p>
        <p>
          version 1.0.0
        </p>
      </footer>
  </>)
}

const wattimeLogoText = <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="220" viewBox="0 0 311.216 61.361">
<defs>
  <clipPath id="clip-path">
    <rect width="311.215" height="61.361" fill="#e8ca28"/>
  </clipPath>
</defs>
<g transform="translate(0 0)">
  <path d="M52.686,13.4,39,44.082,35.779,13.4H26.926L14.134,44.173,10.109,13.4H0L6.62,57.857h9.036L28.445,26.194l3.4,31.663h9.213L61.362,13.4Z" transform="translate(0 2.341)" fill="#e8ca28"/>
  <g transform="translate(0 0)">
    <g clipPath="url(#clip-path)">
      <path d="M77.28,58.03V56.152A54.492,54.492,0,0,1,78,48.461C74.774,55.438,69.41,59.192,62.79,59.192c-7.873,0-13.506-5.364-13.506-12.789,0-10.557,9.661-16.368,27.191-16.368a39.76,39.76,0,0,1,4.563.179,17.48,17.48,0,0,0,.357-3.22c0-4.384-3.31-7.155-8.586-7.155-4.829,0-7.782,1.7-10.288,6.081l-8.766-2.771c3.581-6.891,10.467-10.736,19.41-10.736,11,0,17.979,5.367,17.979,13.776,0,2.414-.087,3.31-2.058,14.042-1.7,9.122-2.235,12.789-2.235,15.295,0,.717,0,1.252.092,2.5ZM69.767,36.564c-6.442,1.252-9.839,4.294-9.839,8.856,0,3.667,2.593,6.081,6.708,6.081s7.873-2.593,10.736-7.334c1.07-1.97,1.609-3.581,2.862-8.856a93.394,93.394,0,0,0-10.465,1.252" transform="translate(8.61 2.169)" fill="#e8ca28"/>
      <path d="M153.995,60.2l7.424-44.457H171.7L164.282,60.2Zm8.317-49.555L164.1,0h10.2l-1.791,10.644Z" transform="translate(26.904 0)" fill="#e8ca28"/>
      <path d="M223.184,58.057l4.472-26.922a26.311,26.311,0,0,0,.539-4.654c0-3.754-2.237-5.812-6.173-5.812-6.529,0-10.823,5.995-12.881,17.888l-3.309,19.5h-9.749l4.294-25.852c.8-4.559.8-4.651.8-6.168,0-3.4-2.058-5.459-5.546-5.459-3.755,0-6.978,2.149-9.48,6.35-1.97,3.31-3.132,7.335-4.563,15.743L179,58.057H169.07L176.5,13.6h9.749l-1.611,9.931c2.95-7.156,8.23-11.271,14.4-11.271,6.711,0,10.379,3.4,11.54,10.467,5.01-7.6,9.3-10.467,15.833-10.467,7.243,0,12.255,4.921,12.255,12.076,0,2.414,0,2.414-1.075,8.5L233.38,58.057Z" transform="translate(29.538 2.142)" fill="#e8ca28"/>
      <path d="M268.465,45.507C264.35,54.632,258,59.1,249.056,59.1c-11.54,0-18.7-7.512-18.7-19.588,0-15.655,9.57-27.1,22.541-27.1,11.537,0,18.071,7.6,18.071,21.111a22.983,22.983,0,0,1-.182,3.488h-30.5a16.709,16.709,0,0,0-.361,3.31c0,6.886,3.579,11.089,9.392,11.089,4.654,0,7.782-2.415,10.465-8.226Zm-6.8-14.847c-.09-7.512-3.04-11.362-8.678-11.362-5.9,0-10.018,3.936-11.715,11.362Z" transform="translate(40.245 2.169)" fill="#e8ca28"/>
      <path d="M100.593,43.366a40.277,40.277,0,0,0-.626,4.92c0,2.684,2.145,4.028,6.26,4.028a28.722,28.722,0,0,0,3.222-.27l-1.344,8.051a34.678,34.678,0,0,1-6.35.623c-7.422,0-11.806-3.484-11.806-9.569,0-1.162,0-1.432.983-7.961L98.358,3.563l8.943-.626Z" transform="translate(15.715 0.513)" fill="#e8ca28"/>
      <path d="M120.158,3.563l8.944-.626-6.709,40.429a40.493,40.493,0,0,0-.626,4.92c0,2.684,2.145,4.028,6.26,4.028a28.739,28.739,0,0,0,3.223-.27l-1.344,8.051a34.7,34.7,0,0,1-6.352.623c-7.425,0-11.806-3.484-11.806-9.569,0-1.162,0-1.432.983-7.961Z" transform="translate(19.523 0.513)" fill="#e8ca28"/>
      <path d="M144.193,43.366a40.274,40.274,0,0,0-.626,4.92c0,2.684,2.145,4.028,6.26,4.028a28.721,28.721,0,0,0,3.222-.27l-1.344,8.051a34.678,34.678,0,0,1-6.35.623c-7.422,0-11.806-3.484-11.806-9.569,0-1.162,0-1.432.983-7.961l7.425-39.624,8.943-.626Z" transform="translate(23.332 0.513)" fill="#e8ca28"/>
      <path d="M163.576,21.034l-25.9,8.9-24.09-11.161L87.807,28.785l1.492-7.96,24.515-9.858,24.558,11.1,26.7-9Z" transform="translate(15.341 1.916)" fill="#e8ca28"/>
    </g>
  </g>
</g>
</svg>

const landingPageGraphic =
  <svg style={{maxWidth: "450px"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 514.865 378">
    <line y1="378" transform="translate(1)" fill="none" stroke="#47464d" strokeWidth="2" strokeDasharray="30 50"/>
    <line y1="378" transform="translate(513.865)" fill="none" stroke="#47464d" strokeWidth="2" strokeDasharray="30 50"/>
    <line y1="378" transform="translate(330.865)" fill="none" stroke="#47464d" strokeWidth="2" strokeDasharray="30 50"/>
    <line y1="378" transform="translate(173.865)" fill="none" stroke="#47464d" strokeWidth="2" strokeDasharray="30 50"/>
    <path d="M591.07,77.835l-172.053,59.12L259.011,62.823l-171.2,66.493,9.909-52.87L260.548,10.967l163.12,73.749L600.98,24.957Z" transform="translate(-87.115 111.533)" fill="#e8ca28" />
  </svg>


export default LandingPage
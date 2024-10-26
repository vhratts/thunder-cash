import {
  NextUIProvider,
  Card,
  CardBody,
  Avatar,
  CardHeader,
} from "@nextui-org/react";
import RootLayout from "../app/layout";
import { useEffect, useState } from "react";
import Head from "next/head";

export default (req, res) => {
  // const protocol = req.headers;
  // console.log(protocol)
  // const host = req.headers.host;
  // const baseUrl = `${protocol}://${host}`;

  // var { data } = await axios.get(`${baseUrl}/api`);
  // console.log(data);

  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;

  console.log(data);
  return (
    <RootLayout>
      <Head>
        <link
          rel="shortcut icon"
          type="image/png"
          href="/assets/images/logo.png"
        />
      </Head>
      <Card>
        <CardBody style={Style.topcard}>
          <Avatar src="/assets/images/logo.png" style={Style.logoIcon} />
          <h3 style={Style.title}>Thunder-Cash</h3>
          <p>API para padronização de provedores de pagamentos PiX</p>
        </CardBody>
      </Card>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
          gridAutoRows: "minmax(100px, auto)",
          marginTop: 20,
        }}
      >
        {data.providerList.map((mp) => {
          return (
            <Card>
              <CardHeader>
                <div>
                  <div>
                    <h2 style={{ fontSize: 25 }}>{mp.name}</h2>
                  </div>
                  <div>
                    <p>{mp.info.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                {/* Obtem a Tag do provedor */}
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div className="col">Tag do provedor:</div>
                  <div className="col">
                    <a
                      href={`/api/${mp.name}`}
                      target="_blank"
                      style={{ color: "#e3670e" }}
                    >
                      {mp.name}
                    </a>
                  </div>
                </div>
                <hr style={{ marginBottom: 10 }} />
                {/* Metodos suportados */}
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div className="col">Methodos:</div>
                  <div className="col">
                    <ul>
                      {mp.methods.map((mt) => {
                        return <li>{mt}</li>;
                      })}
                    </ul>
                  </div>
                </div>
                <hr style={{ marginBottom: 10 }} />
                {/* Metodos de autenticação */}
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div className="col">Autenticação:</div>
                  <div className="col">{mp.authType}</div>
                </div>
                <hr style={{ marginBottom: 10 }} />
                {/* Chaves de autenticação */}
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div className="col">Chaves:</div>
                  <div className="col">
                    <ul>
                      {mp.authItens.map((mt) => {
                        return <li>{mt}</li>;
                      })}
                    </ul>
                  </div>
                </div>
                <hr style={{ marginBottom: 10 }} />
              </CardBody>
            </Card>
          );
        })}
      </div>
    </RootLayout>
  );
};

const Style = {
  topcard: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  logoIcon: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 30,
  },
};

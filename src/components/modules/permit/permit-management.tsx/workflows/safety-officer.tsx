import Section from "../../../../ui/sections";

export default function SafetyOfficer({ response }: any) {
  const details = response;
  const documents = [
    {
      section: "",
      header: "Document Uploads",
      content: [],
    },
  ];

  const documentsArray =
    details?.permitDocuments && details.permitDocuments.length > 0
      ? details.permitDocuments[5]
      : null;

  const documentObject = documentsArray?.document || {};

  const filteredDocuments = details?.permitDocuments.filter(
    (doc) =>
      doc.workflowType === "REVALIDATION" && doc.authority === "SAFETY_OFFICER"
  );

  const revalidationDocuments =
    details?.permitDocuments && details.permitDocuments.length > 0
      ? filteredDocuments
      : [];

  function extractFileName(data) {
    const url = data;

    if (!url) {
      throw new Error("URL is required.");
    }

    const segments = url.split("/");
    const fileName = segments[segments.length - 1];

    const name = fileName.split("-").slice(1).join("-");

    return name;
  }

  const renderDocuments = (type: string) => {
    const documentsToRender =
      type === "REVALIDATION" ? revalidationDocuments : [documentObject];

    console.log(documentsToRender);

    if (!documentsToRender || documentsToRender.length === 0) {
      return <p>No documents uploaded.</p>;
    }

    return documentsToRender.map((doc, docIndex) => {
      const entries = Object.entries(doc.document || {});

      return (
        <div key={`doc-${docIndex}`} className="document-container">
          {/* Add this block to render the SHIFT label once per document */}
          {type === "REVALIDATION" && (
            <div className="">
              <br />
              <h3>
                {type === "REVALIDATION"
                  ? `SHIFT ${doc.revalidationShift || ""}`
                  : ""}
              </h3>
              <br />
            </div>
          )}

          {entries
            .filter(([key, value]) => {
              if (["id", "createdAt", "updatedAt", "draftId"].includes(key)) {
                return false;
              }

              if ((key.includes("Type") || key.includes("Doc")) && !value) {
                return false;
              }

              if (value === null) {
                return false;
              }

              return true; // Keep all other valid entries
            })
            .map(([key, value], index) => {
              // If it's a type field, format the text
              if (key.includes("Type")) {
                return (
                  <div key={`${key}-${index}`} className="document-item">
                    <div className="section__content__document_section">
                      <p className="section__header">
                        {key.replace(/([A-Z])/g, " $1").toUpperCase()}
                      </p>
                    </div>
                    <div className="section__content">
                      <p className="document">
                        <span>Upload Option</span>
                      </p>
                      <p>{value?.toString() || "No document provided"}</p>
                    </div>
                  </div>
                );
              }

              // If it's a document field, render it
              return (
                <div key={`${key}-${index}`} className="document-item">
                  <div className="section__content">
                    <p className="document">
                      <span>Document</span>
                    </p>
                    <p className="document_item">
                      {extractFileName(value)}
                      <span>
                        <img
                          src="/svgs/document_download.svg"
                          alt="Download document"
                        />
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      );
    });
  };

  return (
    <div className={"app-permit__sections"}>
      <br />
      <Section
        type="Permits"
        header="DOCUMENT UPLOADS / ATTACHMENTS"
        children={documents[0]}
        section={documents[0].section}
      />

      <div className="section">
        <div className="">
          <p className="info">
            {Object.keys(documentObject).length > 0 ? (
              renderDocuments("APPROVAL")
            ) : (
              <p>No documents uploaded.</p>
            )}
          </p>
        </div>
      </div>
      <br />

      {details?.revalidations?.length > 0 && (
        <>
          <Section
            type="Permits"
            header={``}
            children={documents[0]}
            section={documents[0].section}
          />

          <div className="section">
            <div className="info">
              {revalidationDocuments.length > 0 ? (
                renderDocuments("REVALIDATION")
              ) : (
                <p>No documents uploaded.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

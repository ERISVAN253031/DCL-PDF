import React, { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import InputMask from "react-input-mask";
import "./DclForm.css";

const DclForm = () => {
  const [numeroDcl, setNumeroDcl] = useState("");
  const [remetente, setRemetente] = useState("");
  const [cnpjRemetente, setCnpjRemetente] = useState("");
  const [cidadeRemetente, setCidadeRemetente] = useState("");
  const [ufRemetente, setUfRemetente] = useState("");
  const [enderecoRemetente, setEnderecoRemetente] = useState("");
  const [bairroRemetente, setBairroRemetente] = useState("");
  const [cepRemetente, setCepRemetente] = useState("");
  const [contatoRemetente, setContatoRemetente] = useState("");
  const [destinatario, setDestinatario] = useState("LABINBRAZ COMERCIAL LTDA");
  const [cnpjDestinatario, setCnpjDestinatario] = useState("73.008.682/0001-52");
  const [cidadeDestinatario, setCidadeDestinatario] = useState("São Paul");
  const [ufDestinatario, setUfDestinatario] = useState("SP");
  const [enderecoDestinatario, setEnderecoDestinatario] = useState("Avenida Guido Caloi , 1935, comp:TERREOBLOCOS A, B");
  const [bairroDestinatario, setBairroDestinatario] = useState("Jardim São Luís");
  const [cepDestinatario, setCepDestinatario] = useState("05802-140");
  const [contatoDestinatario, setContatoDestinatario] = useState("11216203511");
  const [itens, setItens] = useState([{ quantidade: "", descricao: "MAT-HOSPITALAR", codigoProduto: "", peso: "" }]);
  const [valorSimbolico, setValorSimbolico] = useState("");
  const [tipoRemetente, setTipoRemetente] = useState("");
  

  
  const fetchCepData = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) throw new Error("Erro na resposta da API");
      const data = await response.json();
      if (!data.erro) {
        setEnderecoRemetente(data.logradouro);
        setBairroRemetente(data.bairro);
        setCidadeRemetente(data.localidade);
        setUfRemetente(data.uf);
      } else {
        alert("CEP não encontrado!");
        setEnderecoRemetente("");
        setBairroRemetente("");
        setCidadeRemetente("");
        setUfRemetente("");
      }
    } catch (error) {
      alert("Erro ao buscar dados do CEP!");
    }
  };

  const handleCepChange = (e) => {
    const newCep = e.target.value;
    setCepRemetente(newCep);
    const sanitizedCep = newCep.replace(/\D/g, "");
    if (sanitizedCep.length === 8) {
      fetchCepData(sanitizedCep);
    } else {
      setEnderecoRemetente("");
      setBairroRemetente("");
      setCidadeRemetente("");
      setUfRemetente("");
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...itens];
    newItems[index][field] = value;
    setItens(newItems);
  };

  const addItem = () => {
    setItens([...itens, { quantidade: "", descricao: "", codigoProduto: "", peso: "" }]);
  };

  const removeItem = (index) => {
    const newItems = itens.filter((_, i) => i !== index);
    setItens(newItems);
  };

  const drawCenteredText = (page, text, y, fontSize, font, bold = false) => {
    const currentFont = bold ? font.bold : font.regular;
    const textWidth = currentFont.widthOfTextAtSize(text, fontSize);
    const x = (600 - textWidth) / 2;
    page.drawText(text, { x, y, size: fontSize, font: currentFont });
  };

  const splitTextToFit = (text, font, fontSize, maxWidth) => {
    const words = text.split(" ");
    let lines = [];
    let currentLine = "";

    for (let word of words) {
      const testLine = currentLine + (currentLine.length > 0 ? " " : "") + word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  const generatePdf = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const fontSize = 12;
    let yPosition = 740;

    const fontRegular = await pdfDoc.embedFont("Helvetica");
    const fontBold = await pdfDoc.embedFont("Helvetica-Bold");

    // Header
    page.drawText(`Nº da DCL: ${numeroDcl}`, {
      x: 430,
      y: yPosition,
      size: fontSize,
      font: fontRegular,
    });
    yPosition += 30;

    drawCenteredText(
      page,
      "DECLARAÇÃO PARA TRANSPORTE DE MERCADORIA",
      yPosition,
      18,
      { regular: fontBold, bold: fontBold }
    );
    yPosition -= 30;
    drawCenteredText(page, "", yPosition, 20, {
      regular: fontBold,
      bold: fontBold,
    });
    yPosition -= 40;

    // Remetente
    page.drawText("Remetente:", {
      x: 60,
      y: yPosition,
      size: fontSize,
      font: fontBold,
    });
    yPosition -= 15;
    page.drawText(`Nome: ${remetente || ""}`, {
      x: 60,
      y: yPosition,
      size: fontSize,
      font: fontRegular,
    });
    yPosition -= 15;
    page.drawText(`CPF/CNPJ: ${cnpjRemetente || ""}`, {
      x: 60,
      y: yPosition,
      size: fontSize,
      font: fontRegular,
    });
    yPosition -= 15;
    page.drawText(
      `Cidade: ${cidadeRemetente || ""}  UF: ${ufRemetente || ""}`,
      { x: 60, y: yPosition, size: fontSize, font: fontRegular }
    );
    yPosition -= 15;
    page.drawText(`Endereço: ${enderecoRemetente || ""}`, {
      x: 60,
      y: yPosition,
      size: fontSize,
      font: fontRegular,
    });
    yPosition -= 15;
    page.drawText(
      `Bairro: ${bairroRemetente || ""}  CEP: ${cepRemetente || ""}`,
      { x: 60, y: yPosition, size: fontSize, font: fontRegular }
    );
    yPosition -= 15;
    page.drawText(`Contato: ${contatoRemetente || ""}`, {
      x: 60,
      y: yPosition,
      size: fontSize,
      font: fontRegular,
    });
    yPosition -= 20;

    page.drawRectangle({
      x: 50,
      y: yPosition,
      width: 500,
      height: 140,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });
    yPosition -= 40;

    // Destinatário
    page.drawText("Destinatário:", {
      x: 60,
      y: yPosition,
      size: fontSize,
      font: fontBold,
    });
    yPosition -= 15;
    page.drawText(`Nome: ${destinatario}`, {
      x: 60,
      y: yPosition,
      size: fontSize,
      font: fontRegular,
    });
    yPosition -= 15;
    page.drawText(`CPF/CNPJ: ${cnpjDestinatario}`, {
      x: 60,
      y: yPosition,
      size: fontSize,
      font: fontRegular,
    });
    yPosition -= 15;
    page.drawText(`Cidade: ${cidadeDestinatario}  UF: ${ufDestinatario}`, {
      x: 60,
      y: yPosition,
      size: fontSize,
      font: fontRegular,
    });
    yPosition -= 15;
    page.drawText(`Endereço: ${enderecoDestinatario}`, {
      x: 60,
      y: yPosition,
      size: fontSize,
      font: fontRegular,
    });
    yPosition -= 15;
    page.drawText(`Bairro: ${bairroDestinatario}  CEP: ${cepDestinatario}`, {
      x: 60,
      y: yPosition,
      size: fontSize,
      font: fontRegular,
    });
    yPosition -= 15;
    page.drawText(`Contato: ${contatoDestinatario}`, {
      x: 60,
      y: yPosition,
      size: fontSize,
      font: fontRegular,
    });
    yPosition -= 20;

    page.drawRectangle({
      x: 50,
      y: yPosition,
      width: 500,
      height: 140,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });
    yPosition -= 20;

    const declarationText = [
      "Declaramos para os devidos fins, e sob as penas da lei, que nesta data estamos transportando pela AIRSUPPLY LOGISTICA E TRANSPORTES LTDA.",
      "os bens para transporte ao destinatário acima qualificado, devidamente embalados e identificados.",
      "Tais bens não possuem serventia comercial e não requerem, portanto, emissão de Nota Fiscal dada sua natureza e minha condição de não contribuinte do remetente.",
      "Declaramos ainda que nos responsabilizaremos por quaisquer prejuízos que venhamos a sofrer perante o fisco em razão do transporte ora contratado, assim como fornecer as autoridades competentes as informações exigidas por estas.",
    ];

    // Desenhar a declaração
    for (const line of declarationText) {
      const splitLines = splitTextToFit(line, fontRegular, fontSize, 500);
      for (const textLine of splitLines) {
        page.drawText(textLine, {
          x: 60,
          y: yPosition,
          size: fontSize,
          font: fontRegular,
        });
        yPosition -= 15;
      }
      yPosition -= 10;
    }

    // Desenhar o texto "Itens"
    page.drawText("Itens", {
      x: 60,
      y: yPosition,
      size: fontSize,
      font: fontBold,
    });
    yPosition -= 20;

    // Cabeçalho da tabela de itens
    const headers = ["Quantidade", "Descrição", "Código Produto", "Peso"];
    headers.forEach((header, index) => {
      page.drawText(header, {
        x: 60 + index * 130,
        y: yPosition,
        size: fontSize,
        font: fontBold,
      });
    });
    yPosition -= 30;

    // Desenhar linhas da tabela de itens
    itens.forEach((item, index) => {
      const itemYPosition = yPosition;

      page.drawText(item.quantidade || "", {
        x: 60,
        y: itemYPosition,
        size: fontSize,
        font: fontRegular,
      });

      // Quebra de linha para descrição
      const descriptionLines = splitTextToFit(
        item.descricao || "",
        fontRegular,
        fontSize,
        130
      );
      descriptionLines.forEach((line, i) => {
        page.drawText(line, {
          x: 180,
          y: itemYPosition - i * 15,
          size: fontSize,
          font: fontRegular,
        });
      });

      page.drawText(item.codigoProduto || "", {
        x: 320,
        y: itemYPosition,
        size: fontSize,
        font: fontRegular,
      });
      page.drawText(item.peso || "", {
        x: 450,
        y: itemYPosition,
        size: fontSize,
        font: fontRegular,
      });

      yPosition -= Math.max(descriptionLines.length, 1) * 15 + 30; // Atualiza a posição Y para o próximo item
    });

    // Valor Simbólico
    drawCenteredText(
      page,
      `VALOR SIMBÓLICO: ${valorSimbolico}`,
      yPosition,
      fontSize,
      { regular: fontBold, bold: fontBold }
    );
    yPosition -= 40;

    // Assinatura
    drawCenteredText(page, "Assinatura do Responsável:", yPosition, fontSize, {
      regular: fontRegular,
      bold: fontBold,
    });
    yPosition -= 30;

    // Linha para preenchimento
    const lineLength = 550;
    page.drawLine({
      start: { x: (600 - lineLength) / 2, y: yPosition },
      end: { x: (600 + lineLength) / 2, y: yPosition },
      color: rgb(0, 0, 0),
      thickness: 1,
    });

    // Carregar e desenhar a imagem da assinatura
    const signatureUrl = "/ass-italo.png"; // Caminho correto para a imagem
    const signatureImageBytes = await fetch(signatureUrl).then(res => {
      if (!res.ok) throw new Error("Erro ao carregar a imagem da assinatura");
      return res.arrayBuffer();
    });
    const signatureImage = await pdfDoc.embedPng(signatureImageBytes);
    const signatureImageDims = signatureImage.scale(0.5); // Ajuste a escala conforme necessário

    // Desenhar a imagem da assinatura, afastando para a direita
    page.drawImage(signatureImage, {
      x: (600 - lineLength) / 1 + 180, // Afastar para a direita
      y: yPosition - signatureImageDims.height + 23, // Posição abaixo da linha
      width: signatureImageDims.width,
      height: signatureImageDims.height,
    });

    // Carregar e desenhar o logo (segundo logo)
    const logoUrl = "/logo-airsupply.png"; // Ajuste o nome conforme necessário
    const logoImageBytes = await fetch(logoUrl).then(res => {
      if (!res.ok) throw new Error("Erro ao carregar a imagem do logo");
      return res.arrayBuffer();
    });
    const logoImage = await pdfDoc.embedPng(logoImageBytes);
    const logoImageDims = logoImage.scale(0.7); // Ajuste a escala conforme necessário

    // Desenhar o logo na frente do bairro do destinatário
    page.drawImage(logoImage, {
      x: 170, // Ajuste a posição X conforme necessário
      y: yPosition - logoImageDims.height - 15, // Posição acima do bairro
      width: logoImageDims.width,
      height: logoImageDims.height,
    });

    // Carregar e desenhar o carimbo
    const carimboUrl = "/carimbo.png"; // Caminho para a imagem do carimbo
    const carimboImageBytes = await fetch(carimboUrl).then(res => {
      if (!res.ok) throw new Error("Erro ao carregar a imagem do carimbo");
      return res.arrayBuffer();
    });
    const carimboImage = await pdfDoc.embedPng(carimboImageBytes);
    const carimboImageDims = carimboImage.scale(0.5); // Ajuste a escala conforme necessário

    // Desenhar o carimbo ao lado do segundo logo
    page.drawImage(carimboImage, {
      x: 250 + logoImageDims.width + 20, // Colocar ao lado do logo
      y: yPosition - logoImageDims.height - 22, // Mesma altura que o logo
      width: carimboImageDims.width,
      height: carimboImageDims.height,
    });

    // Salvar o PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Declaração-Labinbraz.pdf";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="form-container">
      <h1>DCL Labinbraz</h1>
      <div className="input-dcl">
        <input
          type="text"
          placeholder="Número da DCL"
          value={numeroDcl}
          onChange={(e) => setNumeroDcl(e.target.value)}
        />
      </div>
      <div className="section">
        <h2>
          Remetente:
          <button
            onClick={() =>
              setTipoRemetente(tipoRemetente === "fisica" ? "juridica" : "fisica")
            }
            style={{ marginLeft: "10px", padding: "5px 10px", height: "30px" }}
          >
            {tipoRemetente === "fisica" ? "Pessoa Física" : "Pessoa Jurídica"}
          </button>
        </h2>
        <input
          type="text"
          placeholder="Nome"
          value={remetente}
          onChange={(e) => setRemetente(e.target.value)}
        />
        <InputMask
          mask={tipoRemetente === "fisica" ? "999.999.999-99" : "99.999.999/9999-99"}
          maskChar={null}
          placeholder={tipoRemetente === "fisica" ? "CPF" : "CNPJ"}
          value={cnpjRemetente}
          onChange={(e) => setCnpjRemetente(e.target.value)}
        />
        <InputMask
          mask="99999-999"
          maskChar={null}
          placeholder="CEP"
          value={cepRemetente}
          onChange={handleCepChange}
        />
        <input
          type="text"
          placeholder="UF"
          value={ufRemetente}
          onChange={(e) => setUfRemetente(e.target.value)}
        />
        <input
          type="text"
          placeholder="Endereço"
          value={enderecoRemetente}
          onChange={(e) => setEnderecoRemetente(e.target.value)}
        />
        <input
          type="text"
          placeholder="Bairro"
          value={bairroRemetente}
          onChange={(e) => setBairroRemetente(e.target.value)}
        />

        <InputMask
          mask="(99) 99999-9999"
          maskChar={null}
          placeholder="Contato"
          value={contatoRemetente}
          onChange={(e) => setContatoRemetente(e.target.value)}
        />
      </div>

      <div className="section">
        <h2>Destinatário</h2>
        <input
          type="text"
          placeholder="Nome"
          value={destinatario}
          onChange={(e) => setDestinatario(e.target.value)}
        />
        <InputMask
          mask="99.999.999/9999-99"
          maskChar={null}
          placeholder="CNPJ"
          value={cnpjDestinatario}
          onChange={(e) => setCnpjDestinatario(e.target.value)}
        />
        <InputMask
          mask="99999-999"
          maskChar={null}
          placeholder="CEP"
          value={cepDestinatario}
          onChange={(e) => setCepDestinatario(e.target.value)}
        />
        <input
          type="text"
          placeholder="Cidade"
          value={cidadeDestinatario}
          onChange={(e) => setCidadeDestinatario(e.target.value)}
        />
        <input
          type="text"
          placeholder="UF"
          value={ufDestinatario}
          onChange={(e) => setUfDestinatario(e.target.value)}
        />
        <input
          type="text"
          placeholder="Endereço"
          value={enderecoDestinatario}
          onChange={(e) => setEnderecoDestinatario(e.target.value)}
        />
        <input
          type="text"
          placeholder="Bairro"
          value={bairroDestinatario}
          onChange={(e) => setBairroDestinatario(e.target.value)}
        />

        <InputMask
          mask="(99) 99999-9999"
          maskChar={null}
          placeholder="Contato"
          value={contatoDestinatario}
          onChange={(e) => setContatoDestinatario(e.target.value)}
        />
      </div>

      <div className="section">
        <h2>Itens</h2>
        <div className="item-table">
          <div className="item-row header">
            <div>Quantidade</div>
            <div>Descrição</div>
            <div>Código Produto</div>
            <div>Peso</div>
          </div>
          {itens.map((item, index) => (
            <div key={index} className="item-row">
              <InputMask
                mask="999"
                maskChar={null}
                placeholder="Quantidade"
                value={item.quantidade}
                onChange={(e) =>
                  handleItemChange(index, "quantidade", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Descrição"
                value={item.descricao}
                onChange={(e) =>
                  handleItemChange(index, "descricao", e.target.value)
                }
                maxLength={50} // Limitar a 50 caracteres
              />

              <input
                type="text"
                placeholder="Código Produto"
                value={item.codigoProduto}
                onChange={(e) =>
                  handleItemChange(index, "codigoProduto", e.target.value)
                }
                maxLength={15}
              />

              <InputMask
                mask="999,99 KG"
                maskChar={null}
                placeholder="Peso"
                value={item.peso}
                onChange={(e) =>
                  handleItemChange(index, "peso", e.target.value)
                }
              />

              <button
                type="button"
                style={{
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  cursor: "pointer",
                  borderRadius: "4px",
                  fontWeight: "bold",
                }}
                onClick={() => removeItem(index)}
              >
                Remover
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          style={{ marginTop: "-10px", padding: "10px 15px" }}
          onClick={addItem}
        >
          Adicionar Item
        </button>
      </div>

      <div className="section">
        <h2>Valor Simbólico</h2>
        <input
          type="text"
          placeholder="Valor Simbólico"
          value={valorSimbolico}
          onChange={(e) => setValorSimbolico(e.target.value)}
        />
      </div>

      <button
        style={{ marginTop: "-6px", padding: "10px 15px" }}
        onClick={generatePdf}
      >
        Gerar PDF
      </button>
    </div>
  );
};

export default DclForm;
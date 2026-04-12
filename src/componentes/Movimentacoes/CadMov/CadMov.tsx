import "./CadMovStyle.css"
const CadMov = () => {
  return (
  <>
      <div className="modal-header">
          <h2>Nova Transação</h2>
          <button type="button" className="close-button">
            <span className="material-icons">close</span>
          </button>
        </div>
         <div className="modal-body">
          <div className="transaction-type">
            <button type="button" className="type-btn active">
              Receita
            </button>
            <button type="button" className="type-btn">
              Despesa
            </button>
          </div>

          <div className="input-group">
                <label>Descrição</label>
                <input type="text" placeholder="Ex: Supermercado"/>
            </div>

            <div className="input-group">
                <label>Valor (R$)</label>
                <input type="text" placeholder="0,00"/>
            </div>

            <div className="input-group">
                <label>Categoria</label>
                <select>
                    <option value="" disabled selected>Selecione uma categoria</option>
                    <option value="alimentacao">Alimentação</option>
                    <option value="lazer">Lazer</option>
                    <option value="saude">Saúde</option>
                </select>
            </div>

            <div className="input-group">
                <label>Data</label>
                <input type="date"/>
            </div>
        </div>
  </>
    
  );
};

export default CadMov;

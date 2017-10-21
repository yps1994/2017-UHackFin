class GenericList extends React.Component {
    
       constructor() {
          this.state = {
             items: []
          }
       }
    
       add() {
          this.setState({ items.push("Test");
       }
    
       render() {
    
         let divItems = this.items.map( ( item, index ) => {
            return <div key={index}>{item.value}</div>
         });
    
         return (
           <div>
             {divItems};
             <button onClick={this.add}> Add </button>;
           </div>
         );
       }
    }
}

export default GenericList;
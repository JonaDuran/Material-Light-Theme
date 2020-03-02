
function MyComponent({ name, label }) {
  const object = {
    prop: false || 100,
    // otherProp: null
  }
  const handleClick = () => {
    alert(`Hello ${name}!`)
  }
  return (
    <button onClick={handleClick}>
      {label.toUpperCase()}
    </button>
  )
}



MyComponent

class XEditable extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.id = '_XEditable_' + ++count;
    this.childrenId = this.id + '_children';
  }
  
  getValue() {
    let value = this.$input.editable('getValue', true);
    
    if (typeof value == 'string')
      value = value.trim();
      
    if (value !== '' && value != null)
      return value;
    else 
      return null;
  }
  
  setValue(value) {
    this.$input.editable('setValue', value)
  }
  
  open() {
    this.$input.editable('show');
  }
  
  setSource(source) {
    this.$input.editable('destroy');
    this.didMount(source);
  }
  
  _getDisplay() {
    const { display } = this.props;
    
    if (display == 'id')
      return val => this.$input.html(val)
      
    if (display == 'currency')
      return val => this.$input.html(val ? Format.currency(val) : null);
      
    if (display == 'percent')
      return val => this.$input.html(val ? val + '%' : null);
      
    if (this.props.multiple)
      return val => 
        this.$input.html(!val ? null : val
          .map(id => (
            this.props.source.find(src => src.id == id) || {}
          ).text)
          .join('</br>'));
      
    return null;
  }
  
  _getValidate() {
    const { required, validate } = this.props;
    
    if (!required && !validate)
      return null;
    
    return (val) => {
      if (typeof val === 'string')
        val = val.trim();
      
      if (required == 'validate' && !val)
        return 'Campo requerido';
        
      if (validate && val) {
        const valid = validate(val);
        
        if (valid === false) 
          return 'Formato inválido';
        
        if (typeof valid === 'string') 
          return valid;
      }
    };
  }
  
  didMount(source) {
    const { type } = this.props;
    this.$input = $('#' + this.id);
    
    const config = {
      mode:        this.props.mode,
      emptytext:   this.props.emptytext,
      source:      source || this.props.source,
      showbuttons: this.props.showbuttons,
      onblur:      'submit',
      display:     this._getDisplay(),
      validate:    this._getValidate(),
      value:       this.props.defaultValue,
      placeholder: this.props.placeholder,
      url:         this.props.url,
    };
    
    if (type == 'select2')
      config.select2 = { 
        width:    this.props.width,
        multiple: this.props.multiple
      };
      
    this.$input.editable(config);
    this.$input.on('save', this.props.onChange);
    
    if (this.props.children) {
      this.$children = $('#' + this.childrenId);
      this.$input.on('shown', () => this.$children.show());
      this.$input.on('hidden', () => this.$children.hide());
    }
    else if (type == 'select2' && this.props.autoOpen) {
      this.$input.on('shown', (e, editable) => {
        setTimeout(() => {
          editable.input.$input.select2("open");
        });
      });
    }
    else if (this.props.onShow) {
      this.$children = $('#' + this.childrenId);
      this.$input.on('shown', this.props.onShow);
    }
    
    if (type == 'select2')
      config.select2 = { 
        width:    this.props.width,
        multiple: this.props.multiple
      };
      
    this.$input.editable(config);
    this.$input.on('save', this.props.onChange);
  }

  render() {
    return (
      <div>                                                           {/*  */}
        <a id={this.id} data-type={this.props.type} className='clickable' />
        <div id={this.childrenId} style={{display: 'none', fontWeight: 'bolder'}} >
          { this.props.children }                                     {}
        </div>                                                        {/*  */}
      </div>                                                          // {/*  */}
    );
  }

  componentDidMount() {
    !this.props.noDidMount && this.didMount();
  }
}

export default XEditable;
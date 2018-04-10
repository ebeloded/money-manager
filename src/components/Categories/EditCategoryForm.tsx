// import * as React from 'react';
// import styled from 'styled-components';
// import { CategoryType } from '@constants';

// interface Props {
//   category?: Category;
// }

// interface State {
//   id?: string;
//   name: string;
//   created?: number;
//   readonly type: CategoryType;
// }

// const FormWrap = styled.form`
//   border: solid 1px #333;  
// `;

// export class EditCategoryForm extends React.Component<Props, State> {

//   constructor (props: Props) {
//     super(props);
//     this.state = props.category ? { ...props.category } : {
//       name: '',
//       type: CategoryType.EXPENSE
//     };
//   }

//   handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     // Add the category to the database
//   }

//   handleChange = (event: React.FormEvent<HTMLInputElement>) => {
//     this.setState({
//       name: event.currentTarget.value
//     });
//   }

//   render () {
//     return (
//       <FormWrap onSubmit={this.handleSubmit}>
//         <label htmlFor="">Name
//           <input type="text" name="name" onChange={this.handleChange} value={this.state.name} />
//         </label>
//         <input type="submit" value="Submit" />
//       </FormWrap>
//     );
//   }
// }

// export const AddCategoryForm = () => (<EditCategoryForm />);
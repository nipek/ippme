import React from 'react';
import { MdSearch } from 'react-icons/md';
import { Form, Input } from 'reactstrap';

const SearchInput = ({
  search,
  placeholder,
  searchAction,
  onChange,
  ...props
}) => {
  return (
    <Form
      inline
      className="cr-search-form"
      onSubmit={e => {
        e.preventDefault();
        searchAction();
      }}
    >
      <MdSearch
        size="20"
        className="cr-search-form__icon-search text-secondary"
      />
      <Input
        onChange={onChange}
        required
        value={search}
        type="search"
        className="cr-search-form__input"
        placeholder={placeholder}
      />
    </Form>
  );
};

export default SearchInput;

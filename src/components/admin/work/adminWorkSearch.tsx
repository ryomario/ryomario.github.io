import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from "@mui/material/CircularProgress";

type Props = {
  redirectPath: (id: string) => string;
}

export function AdminWorkSearch({ redirectPath }: Props) {
  const router = useRouter();

  const [query, setQuery] = useState('');

  const loading = false;

  const handleChange = useCallback((item: any) => {
    console.log('selected', item);
  },[redirectPath, router]);

  return (
    <Autocomplete
      autoHighlight
      popupIcon={null}
      // loading={loading}
      options={[]}
      value={null}
      onChange={(_event, newValue) => handleChange(newValue)}
      onInputChange={(_event, newValue) => setQuery(newValue)}
      sx={{
        width: { xs: 1, sm: 260 },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search..."
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ ml: 1, color: 'text.disabled' }} />
                </InputAdornment>
              ),
              endAdornment: <>
                {loading && <CircularProgress size="1em" sx={{ mr: -3 }}/>}
                {params.InputProps.endAdornment}
              </>,
            }
          }}
        />
      )}
    />
  );
}
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";

import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from "@mui/material/CircularProgress";
import { useDebounce } from "@/hooks/debouncedValue";

import * as RepoEducationsServer from "@/db/repositories/RepoEducations.server";
import { Logger } from "@/utils/logger";
import { SxProps, Theme } from "@mui/material/styles";
import Link, { linkClasses } from "@mui/material/Link";
import { AdminSearchNotFound } from "../adminSearchNotFound";
import RouterLink from "next/link";
import Typography from "@mui/material/Typography";
import { IEducation } from "@/types/IEducation";
import { dbEducationTransform } from "@/db/utils/educationTransforms";

type Props = {
  redirectPath: (id: string) => string;
}

export function AdminEducationSearch({ redirectPath }: Props) {
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<IEducation|null>(null);

  const debouncedQuery = useDebounce(query, 500);
  const { results: options, loading } = useSearchData(debouncedQuery);

  const handleChange = useCallback((item: IEducation|null) => {
    setSelectedItem(item);
    if(item) {
      router.push(redirectPath(`${item.id}`));
    }
  },[redirectPath, router]);

  const paperStyles: SxProps<Theme> = {
    width: 320,
    [` .${autocompleteClasses.listbox} .${autocompleteClasses.option}`]: {
      p: 0,
      [` .${linkClasses.root}`]: {
        px: 1,
        py: 0.75,
        width: 1,
      },
    },
  };

  return (
    <Autocomplete
      autoHighlight
      popupIcon={null}
      loading={loading}
      options={options}
      // disable built-in filter
      filterOptions={(options) => options}
      value={selectedItem}
      onChange={(_event, newValue) => handleChange(newValue)}
      onInputChange={(_event, newValue) => setQuery(newValue)}
      getOptionLabel={(option) => option.schoolName}
      noOptionsText={<AdminSearchNotFound query={debouncedQuery}/>}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      slotProps={{ paper: { sx: paperStyles } }}
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
      renderOption={(props, education, { inputValue }) => {
        const matches_title = match(education.schoolName, inputValue, { insideWords: true, findAllOccurrences: true });
        const parts_title = parse(education.schoolName, matches_title);

        const matches_company = match(education.degree, inputValue, { insideWords: true, findAllOccurrences: true });
        const parts_company = parse(education.degree, matches_company);

        return (
          <li {...props} key={`search-option-${education.id}`}>
            <Link
              key={inputValue}
              component={RouterLink}
              href={redirectPath(`${education.id}`)}
              color="inherit"
              underline="none"
            >
              {parts_title.map((part, index) => (
                <Typography
                  key={index}
                  component="span"
                  color={part.highlight ? 'primary' : 'textPrimary'}
                  sx={{
                    typography: 'body2',
                    fontWeight: part.highlight ? 'fontWeightSemiBold' : 'fontWeightMedium',
                  }}
                >
                  {part.text}
                </Typography>
              ))}
              <br />
              {parts_company.map((part, index) => (
                <Typography
                  key={index}
                  component="span"
                  color={part.highlight ? 'primary' : 'textDisabled'}
                  sx={{
                    typography: 'caption',
                    fontWeight: part.highlight ? 'fontWeightSemiBold' : 'fontWeightMedium',
                  }}
                >
                  {part.text}
                </Typography>
              ))}
            </Link>
          </li>
        );
      }}
    />
  );
}

function useSearchData(searchQuery: string) {
  const [results, setResults] = useState<IEducation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = useCallback(async () => {
    setLoading(true);

    try {
      const resData = await RepoEducationsServer.getAllByFilter({ q: searchQuery });

      setResults(resData.map(dbEducationTransform));
    } catch (error) {
      Logger.error(error, 'Education Search error');
    } finally {
      setLoading(false);
    }
  },[searchQuery]);

  useEffect(() => {
    if(searchQuery) {
      fetchResults();
    } else {
      setResults([]);
    }
  }, [fetchResults, searchQuery]);

  return { results, loading };
}
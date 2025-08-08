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

import * as RepoProjectsServer from "@/db/repositories/RepoProjects.server";
import { Logger } from "@/utils/logger";
import { SxProps, Theme } from "@mui/material/styles";
import Link, { linkClasses } from "@mui/material/Link";
import { AdminSearchNotFound } from "../adminSearchNotFound";
import RouterLink from "next/link";
import Typography from "@mui/material/Typography";
import { IProject } from "@/types/IProject";

type Props = {
  redirectPath: (id: string) => string;
}

export function AdminProjectSearch({ redirectPath }: Props) {
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<IProject | null>(null);

  const debouncedQuery = useDebounce(query, 500);
  const { results: options, loading } = useSearchData(debouncedQuery);

  const handleChange = useCallback((item: IProject | null) => {
    setSelectedItem(item);
    if (item) {
      router.push(redirectPath(`${item.id}`));
    }
  }, [redirectPath, router]);

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
      getOptionLabel={(option) => option.title}
      noOptionsText={<AdminSearchNotFound query={debouncedQuery} />}
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
                {loading && <CircularProgress size="1em" sx={{ mr: -3 }} />}
                {params.InputProps.endAdornment}
              </>,
            }
          }}
        />
      )}
      renderOption={(props, work, { inputValue }) => {
        const matches_title = match(work.title, inputValue, { insideWords: true, findAllOccurrences: true });
        const parts_title = parse(work.title, matches_title);

        const matches_desc = match(work.desc, inputValue, { insideWords: true, findAllOccurrences: true });
        const parts_desc = parse(work.desc, matches_desc);

        let parts_desc_cutted: typeof parts_desc = [];
        const max_desc_length = 35;
        const firstHighlightedPart_index = parts_desc.findIndex(part => part.highlight);

        let i, j, currLength = 0;
        j = firstHighlightedPart_index == -1 ? 0 : firstHighlightedPart_index;
        i = j - 1;

        while (currLength < max_desc_length) {
          const part_i = parts_desc[i];
          const part_j = parts_desc[j];
          if (part_j.text.length > (max_desc_length - currLength)) {
            part_j.text = `${part_j.text.substring(0, max_desc_length - currLength - 3)}...`;
          }
          parts_desc_cutted.push(part_j);
          currLength += part_j.text.length;

          if (currLength >= max_desc_length) {
            break;
          }

          if (i != j && i >= 0) {
            if (part_i.text.length > (max_desc_length - currLength)) {
              part_i.text = `...${part_i.text.substring(part_i.text.length - max_desc_length - currLength - 3)}`;
            }
            parts_desc_cutted.unshift(part_i);
            currLength += part_i.text.length;
          }

          if (i > 0) i--;
          if (j < (parts_desc.length - 1)) j++;
        }

        const last_part = parts_desc_cutted[parts_desc_cutted.length - 1];
        if (parts_desc[j] && parts_desc[j] !== last_part && !last_part.text.endsWith('...')) {
          last_part.text = `${last_part.text}...`;
        }

        return (
          <li {...props} key={`search-option-${work.id}`}>
            <Link
              key={inputValue}
              component={RouterLink}
              href={redirectPath(`${work.id}`)}
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
              {parts_desc_cutted.map((part, index) => (
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
  const [results, setResults] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = useCallback(async () => {
    setLoading(true);

    try {
      const resData = await RepoProjectsServer.getAll({ filter: { q: searchQuery }, offset: 0, limit: 10 });

      setResults(resData);
    } catch (error) {
      Logger.error(error, 'Project Search error');
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery) {
      fetchResults();
    } else {
      setResults([]);
    }
  }, [fetchResults, searchQuery]);

  return { results, loading };
}
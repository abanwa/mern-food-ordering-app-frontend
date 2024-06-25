import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect } from "react";

// this is to validate the form
const formSchema = z.object({
  searchQuery: z.string({
    required_error: "Restaurant name is required"
  })
});

// these are the search form props or properties
type Props = {
  onSubmit: (formData: SearchForm) => void;
  placeHolder: string;
  onReset?: () => void;
  searchQuery?: string;
};

export type SearchForm = z.infer<typeof formSchema>;

const SearchBar = ({ onSubmit, placeHolder, onReset, searchQuery }: Props) => {
  // initialize a new form
  const form = useForm<SearchForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchQuery
    }
  });

  //   This will run when the page first loads and when the searchQuery changes
  useEffect(() => {
    form.reset({
      searchQuery
    });
  }, [form, searchQuery]);

  //   THIS WILL RESET THE FORM WHEN WE CLICK CLEAR BUTTON
  const handleReset = () => {
    form.reset({
      searchQuery: ""
    });

    // we always want to reset the form even when user click reset. we want to ensure that we call onReset function that is parse by the parent. we will check if we recieve the onReset property

    if (onReset) {
      onReset();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`flex items-center gap-3 justify-between flex-row border-2 rounded-full p-3 ${
          form.formState.errors.searchQuery && "border-red-500"
        }`}
      >
        <Search
          strokeWidth={2.5}
          size={30}
          className="ml-1 text-orange-500 hidden md:block"
        />
        <FormField
          control={form.control}
          name="searchQuery"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  {...field}
                  className="border-none shadow-none text-xl focus-visible:ring-0"
                  placeholder={placeHolder}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          onClick={handleReset}
          type="button"
          variant="outline"
          className="rounded-full"
        >
          Reset
        </Button>
        <Button type="submit" className="rounded-full bg-orange-500">
          Search
        </Button>
      </form>
    </Form>
  );
};

export default SearchBar;

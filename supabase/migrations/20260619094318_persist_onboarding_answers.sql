-- Persist the pre-auth onboarding interview in the same transaction that creates the
-- profile row. A client-side UPDATE after sign-up is not reliable when email
-- confirmation is enabled because the new user does not have an authenticated session.
create or replace function public.tg_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name, phone, skin_type, concerns)
  values (
    new.id,
    pg_catalog.nullif(new.raw_user_meta_data ->> 'name', ''),
    pg_catalog.nullif(new.raw_user_meta_data ->> 'phone', ''),
    case new.raw_user_meta_data ->> 'skin_type'
      when 'oily' then 'oily'::public.skin_type
      when 'dry' then 'dry'::public.skin_type
      when 'combination' then 'combination'::public.skin_type
      when 'normal' then 'normal'::public.skin_type
      when 'sensitive' then 'sensitive'::public.skin_type
      else null
    end,
    case
      when pg_catalog.jsonb_typeof(new.raw_user_meta_data -> 'concerns') = 'array'
        then array(
          select concern.value
          from pg_catalog.jsonb_array_elements_text(
            new.raw_user_meta_data -> 'concerns'
          ) as concern(value)
        )
      else '{}'::text[]
    end
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

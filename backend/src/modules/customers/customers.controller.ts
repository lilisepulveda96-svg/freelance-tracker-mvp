import type { Request, Response } from "express";
import { supabaseAdmin } from "../../config/supabase";
import type {
  CreateCustomerInput,
  UpdateCustomerInput,
} from "./customers.schema";

export const getCustomers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user!.id;

  const start = Number(req.query._start ?? 0);
  const end = Number(req.query._end ?? 10);

  const { data, error, count } = await supabaseAdmin
    .from("customers")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .range(start, end - 1);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.setHeader("Content-Range", `customers ${start}-${end - 1}/${count}`);
  res.json(data);
};

export const getCustomer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user!.id;
  const { id } = req.params;

  const { data, error } = await supabaseAdmin
    .from("customers")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) {
    res.status(404).json({ error: "Customer not found" });
    return;
  }

  res.json(data);
};

export const createCustomer = async (
  req: Request<object, object, CreateCustomerInput>,
  res: Response,
): Promise<void> => {
  const userId = req.user!.id;

  const { data, error } = await supabaseAdmin
    .from("customers")
    .insert({ ...req.body, user_id: userId })
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json(data);
};

export const updateCustomer = async (
  req: Request<{ id: string }, object, UpdateCustomerInput>,
  res: Response,
): Promise<void> => {
  const userId = req.user!.id;
  const { id } = req.params;

  const { data, error } = await supabaseAdmin
    .from("customers")
    .update(req.body)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(data);
};

export const deleteCustomer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user!.id;
  const { id } = req.params;

  const { error } = await supabaseAdmin
    .from("customers")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(204).send();
};
